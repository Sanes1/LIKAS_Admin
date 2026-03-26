import { db } from "../firebase/config";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  onSnapshot,
  query,
  serverTimestamp 
} from "firebase/firestore";

// Projects
export const createProject = async (projectData) => {
  try {
    console.log("createProject called with:", projectData);
    
    // Get current user info
    const userStr = localStorage.getItem("lguUser");
    let postedBy = { name: "Unknown", barangay: "Unknown", city: "Unknown" };
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        postedBy = {
          uid: user.uid,
          name: user.name,
          barangay: user.barangay,
          city: user.city,
          position: user.position,
          email: user.email
        };
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
    
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, {
      ...projectData,
      postedBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: projectData.status || 'draft'
    });
    console.log("Project saved successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error in createProject:", error);
    throw error;
  }
};

export const updateProject = async (projectId, updates) => {
  const projectRef = doc(db, 'projects', projectId);
  
  // If updating to completed status, ensure we preserve critical fields
  if (updates.status === 'completed') {
    // Get current project data to preserve important fields
    const currentProject = await getProject(projectId);
    
    // Ensure critical fields are preserved
    const safeUpdates = {
      ...updates,
      // Preserve description if not explicitly being updated
      description: updates.description || currentProject?.description || "",
      // Preserve tags if not explicitly being updated
      tags: updates.tags || currentProject?.tags || [],
      // Preserve postedBy if not explicitly being updated  
      postedBy: updates.postedBy || currentProject?.postedBy || null,
      // Preserve category/subject
      category: updates.category || currentProject?.category || "",
      // Preserve title
      title: updates.title || currentProject?.title || currentProject?.missionTitle || "",
      updatedAt: serverTimestamp()
    };
    
    console.log("🔒 Preserving fields for completed mission:", {
      projectId,
      description: safeUpdates.description,
      tags: safeUpdates.tags?.length,
      postedBy: safeUpdates.postedBy?.name
    });
    
    await updateDoc(projectRef, safeUpdates);
  } else {
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }
};

export const deleteProject = async (projectId) => {
  const projectRef = doc(db, 'projects', projectId);
  await deleteDoc(projectRef);
};

export const listenToProjects = (callback, errorCallback) => {
  const projectsRef = collection(db, 'projects');
  return onSnapshot(
    projectsRef, 
    (snapshot) => {
      const projectsArray = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Debug logging for completed missions
        if (data.status === 'completed') {
          console.log(`🔍 RAW Firebase data for completed mission ${doc.id}:`, {
            id: doc.id,
            title: data.title,
            description: data.description,
            missionDescription: data.missionDescription,
            projectDescription: data.projectDescription,
            tags: data.tags,
            postedBy: data.postedBy,
            allFields: Object.keys(data),
            FULL_DATA: data  // Show complete object
          });
        }
        
        return {
          id: doc.id,
          ...data,
          // Ensure tags is always an array
          tags: data.tags ? (Array.isArray(data.tags) ? data.tags : Object.values(data.tags)) : [],
          // Ensure other array fields are arrays too
          applicants: data.applicants ? (Array.isArray(data.applicants) ? data.applicants : Object.values(data.applicants)) : [],
          milestones: data.milestones ? (Array.isArray(data.milestones) ? data.milestones : Object.values(data.milestones)) : [],
        };
      });
      callback(projectsArray);
    },
    (error) => {
      console.error("Error in listenToProjects:", error);
      if (errorCallback) errorCallback(error);
    }
  );
};

export const getProject = async (projectId) => {
  const projectRef = doc(db, 'projects', projectId);
  const snapshot = await getDoc(projectRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return { 
      id: snapshot.id, 
      ...data,
      // Ensure tags is always an array
      tags: data.tags ? (Array.isArray(data.tags) ? data.tags : Object.values(data.tags)) : [],
      // Ensure other array fields are arrays too
      applicants: data.applicants ? (Array.isArray(data.applicants) ? data.applicants : Object.values(data.applicants)) : [],
      milestones: data.milestones ? (Array.isArray(data.milestones) ? data.milestones : Object.values(data.milestones)) : [],
    };
  }
  return null;
};

// Competency Tags
export const saveCompetencyTags = async (projectId, tags) => {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, { 
    tags,
    updatedAt: serverTimestamp()
  });
};

export const updateTagStatus = async (projectId, tagId, status) => {
  const project = await getProject(projectId);
  if (project && project.tags) {
    const updatedTags = project.tags.map(tag => 
      tag.id === tagId ? { ...tag, status } : tag
    );
    await saveCompetencyTags(projectId, updatedTags);
  }
};

// Student Collaboration
export const assignStudent = async (projectId, studentData) => {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, {
    student: studentData,
    status: 'active',
    assignedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateMilestone = async (projectId, milestoneId, milestoneData) => {
  const project = await getProject(projectId);
  if (project && project.milestones) {
    const updatedMilestones = project.milestones.map(m =>
      m.id === milestoneId ? { ...m, ...milestoneData, updatedAt: serverTimestamp() } : m
    );
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, { 
      milestones: updatedMilestones,
      updatedAt: serverTimestamp()
    });
  }
};

export const saveGroundTruth = async (projectId, groundTruthData) => {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, {
    groundTruth: {
      ...groundTruthData,
      submittedAt: serverTimestamp()
    },
    updatedAt: serverTimestamp()
  });
};

// Analysis Data
export const saveAnalysis = async (projectId, analysisData) => {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, {
    analysis: {
      ...analysisData,
      analyzedAt: serverTimestamp()
    },
    updatedAt: serverTimestamp()
  });
};

// Create notification for LGU
export const createNotification = async (notificationData) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    await addDoc(notificationsRef, {
      ...notificationData,
      timestamp: new Date().toISOString(),
      read: false,
      createdAt: serverTimestamp()
    });
    console.log("✅ Notification created successfully");
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    throw error;
  }
};

// Slot Management Functions
export const canStudentAcceptMission = async (projectId, studentId) => {
  const project = await getProject(projectId);
  if (!project) return { canAccept: false, reason: "Mission not found" };
  
  // Check if mission is full
  const completedCount = project.completedStudents?.length || 0;
  const assignedCount = project.assignedStudents?.length || 0;
  const totalSlots = project.slots || 1;
  
  if (completedCount + assignedCount >= totalSlots) {
    return { canAccept: false, reason: "All slots are filled" };
  }
  
  // Check if student already accepted or completed
  if (project.assignedStudents?.includes(studentId)) {
    return { canAccept: false, reason: "You already accepted this mission" };
  }
  
  if (project.completedStudents?.includes(studentId)) {
    return { canAccept: false, reason: "You already completed this mission" };
  }
  
  return { canAccept: true, reason: "" };
};

export const assignStudentToMission = async (projectId, studentId, studentData) => {
  const project = await getProject(projectId);
  if (!project) throw new Error("Mission not found");
  
  // Verify student can accept
  const check = await canStudentAcceptMission(projectId, studentId);
  if (!check.canAccept) throw new Error(check.reason);
  
  const projectRef = doc(db, 'projects', projectId);
  const assignedStudents = project.assignedStudents || [];
  const slotsRemaining = (project.slotsRemaining || project.slots || 1) - 1;
  
  await updateDoc(projectRef, {
    assignedStudents: [...assignedStudents, studentId],
    slotsRemaining: slotsRemaining,
    status: slotsRemaining === 0 ? 'full' : 'active',
    student: studentData, // For backward compatibility
    updatedAt: serverTimestamp()
  });
  
  console.log(`✅ Student ${studentId} assigned to mission ${projectId}`);
};

export const completeStudentMission = async (projectId, studentId) => {
  const project = await getProject(projectId);
  if (!project) throw new Error("Mission not found");
  
  const projectRef = doc(db, 'projects', projectId);
  
  // Remove from assigned, add to completed
  const assignedStudents = (project.assignedStudents || []).filter(id => id !== studentId);
  const completedStudents = [...(project.completedStudents || []), studentId];
  
  // Check if all slots are now completed
  const totalSlots = project.slots || 1;
  const allCompleted = completedStudents.length >= totalSlots;
  
  await updateDoc(projectRef, {
    assignedStudents: assignedStudents,
    completedStudents: completedStudents,
    status: allCompleted ? 'completed' : 'active',
    updatedAt: serverTimestamp()
  });
  
  console.log(`✅ Student ${studentId} completed mission ${projectId}. ${completedStudents.length}/${totalSlots} slots filled.`);
  
  return { allCompleted, completedCount: completedStudents.length, totalSlots };
};
