import { firestore } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

// Convert Firebase error codes to user-friendly messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested data was not found.',
    'already-exists': 'This data already exists.',
    'resource-exhausted': 'Too many requests. Please try again later.',
    'failed-precondition': 'Operation failed. Please try again.',
    'aborted': 'Operation was aborted. Please try again.',
    'out-of-range': 'Invalid data range.',
    'unimplemented': 'This feature is not yet implemented.',
    'internal': 'Internal error occurred. Please try again later.',
    'unavailable': 'Service is temporarily unavailable. Please try again later.',
    'data-loss': 'Data loss occurred. Please contact support.',
    'unauthenticated': 'Please sign in to continue.',
    'invalid-argument': 'Invalid data provided. Please check your input.',
    'deadline-exceeded': 'Request timeout. Please try again.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Get student data
export const getStudentData = async (userId) => {
  try {
    const studentRef = doc(firestore, 'students', userId);
    const snapshot = await getDoc(studentRef);
    
    if (snapshot.exists()) {
      return { success: true, data: snapshot.data() };
    } else {
      return { success: false, error: 'Student profile not found.' };
    }
  } catch (error) {
    console.error('Get student data error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Update student tokens
export const updateStudentTokens = async (userId, tokensToAdd) => {
  try {
    console.log(`💰 Updating tokens for user ${userId}, adding ${tokensToAdd} tokens`);
    const studentRef = doc(firestore, 'students', userId);
    const snapshot = await getDoc(studentRef);
    
    if (snapshot.exists()) {
      const currentTokens = snapshot.data().tokens || 0;
      const newBalance = currentTokens + tokensToAdd;
      
      console.log(`Current tokens: ${currentTokens}, New balance: ${newBalance}`);
      
      await updateDoc(studentRef, {
        tokens: newBalance,
        lastTokenUpdate: serverTimestamp()
      });
      
      console.log(`✅ Tokens updated successfully to ${newBalance}`);
      return { success: true, newBalance };
    } else {
      console.error(`❌ Student profile not found for user ${userId}`);
      console.log('Creating student profile with initial tokens...');
      
      // Create the student document if it doesn't exist
      await setDoc(studentRef, {
        tokens: tokensToAdd,
        lastTokenUpdate: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
      
      console.log(`✅ Student profile created with ${tokensToAdd} tokens`);
      return { success: true, newBalance: tokensToAdd };
    }
  } catch (error) {
    console.error('❌ Update tokens error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Submit project
export const submitProject = async (userId, projectData) => {
  try {
    const projectId = Date.now().toString();
    const projectRef = doc(firestore, 'projects', projectId);
    
    await setDoc(projectRef, {
      ...projectData,
      userId,
      projectId,
      submittedAt: projectData.submittedAt || new Date().toISOString(),
      status: projectData.status || 'completed',
      createdAt: serverTimestamp()
    });
    
    return { success: true, projectId };
  } catch (error) {
    console.error('Submit project error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Get student projects
export const getStudentProjects = async (userId) => {
  try {
    const projectsRef = collection(firestore, 'projects');
    const q = query(
      projectsRef, 
      where('userId', '==', userId),
      orderBy('submittedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const projects = [];
    
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, projects };
  } catch (error) {
    console.error('Get student projects error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Get project by ID
export const getProjectById = async (projectId) => {
  try {
    const projectRef = doc(firestore, 'projects', projectId);
    const snapshot = await getDoc(projectRef);
    
    if (snapshot.exists()) {
      return { success: true, project: { id: snapshot.id, ...snapshot.data() } };
    } else {
      return { success: false, error: 'Project not found.' };
    }
  } catch (error) {
    console.error('Get project error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Get student statistics
export const getStudentStats = async (userId) => {
  try {
    const projectsResult = await getStudentProjects(userId);
    const studentResult = await getStudentData(userId);
    
    if (projectsResult.success && studentResult.success) {
      const projects = projectsResult.projects;
      const totalProjects = projects.length;
      const totalTokens = studentResult.data.tokens || 0;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      
      // Calculate subject breakdown
      const subjectBreakdown = {};
      projects.forEach(p => {
        if (p.subject) {
          subjectBreakdown[p.subject] = (subjectBreakdown[p.subject] || 0) + 1;
        }
      });
      
      return {
        success: true,
        stats: {
          totalProjects,
          completedProjects,
          totalTokens,
          progressToMajor: Math.min((totalTokens / 100) * 100, 100),
          subjectBreakdown,
          recentProjects: projects.slice(0, 5)
        }
      };
    } else {
      return { success: false, error: 'Unable to load statistics. Please try again.' };
    }
  } catch (error) {
    console.error('Get stats error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Get all projects (for admin/teammate)
export const getAllProjects = async () => {
  try {
    const projectsRef = collection(firestore, 'projects');
    const q = query(projectsRef, orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const projects = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, projects };
  } catch (error) {
    console.error('Get all projects error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Get all students (for admin/teammate)
export const getAllStudents = async () => {
  try {
    const studentsRef = collection(firestore, 'students');
    const snapshot = await getDocs(q);
    
    const students = [];
    snapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, students };
  } catch (error) {
    console.error('Get all students error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Get available missions/projects from LGU (approved and matching status)
export const getAvailableMissions = async () => {
  try {
    console.log('🔍 Fetching available missions from Firestore...');
    const projectsRef = collection(firestore, 'projects');
    
    // Simplified query - just get all projects first, then filter
    const snapshot = await getDocs(projectsRef);
    console.log(`📦 Total projects in database: ${snapshot.size}`);
    
    const missions = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📄 Project ${doc.id}:`, {
        title: data.title,
        status: data.status,
        tier: data.tier,
        category: data.category,
        tagsCount: data.tags?.length || 0,
        hasApprovedTags: data.tags?.some(tag => tag.status === 'approved')
      });
      
      // Filter for matching or active projects
      if (data.status === 'matching' || data.status === 'active') {
        // Only include projects with at least one approved tag
        if (data.tags && data.tags.length > 0) {
          const hasApprovedTags = data.tags.some(tag => tag.status === 'approved');
          if (hasApprovedTags) {
            console.log(`✅ Including project: ${data.title}`);
            missions.push({ 
              id: doc.id, 
              ...data,
              // Ensure tags is always an array
              tags: Array.isArray(data.tags) ? data.tags : Object.values(data.tags || {})
            });
          } else {
            console.log(`⏳ Skipping ${data.title} - no approved tags yet`);
          }
        } else {
          console.log(`⏳ Skipping ${data.title} - no tags yet`);
        }
      } else {
        console.log(`❌ Skipping ${data.title} - status is ${data.status}`);
      }
    });
    
    console.log(`✨ Returning ${missions.length} available missions`);
    return { success: true, missions };
  } catch (error) {
    console.error('❌ Get available missions error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message),
      missions: [] // Return empty array on error
    };
  }
};

// Apply for a mission
export const applyForMission = async (userId, missionId, applicationData) => {
  try {
    const projectRef = doc(firestore, 'projects', missionId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      return { success: false, error: 'Mission not found.' };
    }
    
    const projectData = projectSnap.data();
    const applicants = projectData.applicants || [];
    
    // Check if already applied
    const alreadyApplied = applicants.some(app => app.userId === userId);
    if (alreadyApplied) {
      return { success: false, error: 'You have already applied for this mission.' };
    }
    
    // Add application
    applicants.push({
      userId,
      ...applicationData,
      appliedAt: serverTimestamp(),
      status: 'pending'
    });
    
    await updateDoc(projectRef, {
      applicants,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Apply for mission error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Unlock Major project by spending tokens
export const unlockMajorProject = async (userId, tokensToSpend = 100) => {
  try {
    const studentRef = doc(firestore, 'students', userId);
    const snapshot = await getDoc(studentRef);
    
    if (!snapshot.exists()) {
      return { success: false, error: 'Student profile not found.' };
    }
    
    const currentTokens = snapshot.data().tokens || 0;
    
    if (currentTokens < tokensToSpend) {
      return { 
        success: false, 
        error: `Insufficient tokens. You have ${currentTokens} tokens but need ${tokensToSpend}.` 
      };
    }
    
    const newBalance = currentTokens - tokensToSpend;
    
    await updateDoc(studentRef, {
      tokens: newBalance,
      lastTokenUpdate: serverTimestamp(),
      majorProjectsUnlocked: (snapshot.data().majorProjectsUnlocked || 0) + 1
    });
    
    return { success: true, newBalance };
  } catch (error) {
    console.error('Unlock major project error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Update student profile
export const updateStudentProfile = async (userId, updates) => {
  try {
    const studentRef = doc(firestore, 'students', userId);
    
    await updateDoc(studentRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Upload profile photo to Firebase Storage
export const uploadProfilePhoto = async (userId, file) => {
  try {
    const { storage } = await import('../firebase/config');
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    
    // Create a reference to the file location
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profile-photos/${fileName}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const photoURL = await getDownloadURL(storageRef);
    
    // Update student profile with photo URL
    await updateStudentProfile(userId, { photoURL });
    
    return { success: true, photoURL };
  } catch (error) {
    console.error('Upload photo error:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};

// Create notification for LGU
export const createNotification = async (notificationData) => {
  try {
    const { addDoc } = await import('firebase/firestore');
    const notificationsRef = collection(firestore, 'notifications');
    
    await addDoc(notificationsRef, {
      ...notificationData,
      timestamp: new Date().toISOString(),
      read: false,
      createdAt: serverTimestamp()
    });
    
    console.log("✅ Notification created successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    return { 
      success: false, 
      error: getErrorMessage(error.code || error.message) 
    };
  }
};
