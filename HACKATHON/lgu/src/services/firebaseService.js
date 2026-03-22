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
  await updateDoc(projectRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
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
