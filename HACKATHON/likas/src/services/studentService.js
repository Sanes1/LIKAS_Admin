import { database } from '../firebase/config';
import { ref, get, set, update } from 'firebase/database';

// Get student data
export const getStudentData = async (userId) => {
  try {
    const studentRef = ref(database, `students/${userId}`);
    const snapshot = await get(studentRef);
    
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    } else {
      return { success: false, error: 'Student not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update student tokens
export const updateStudentTokens = async (userId, tokensToAdd) => {
  try {
    const studentRef = ref(database, `students/${userId}`);
    const snapshot = await get(studentRef);
    
    if (snapshot.exists()) {
      const currentTokens = snapshot.val().tokens || 0;
      const newBalance = currentTokens + tokensToAdd;
      await update(studentRef, {
        tokens: newBalance,
        lastTokenUpdate: new Date().toISOString()
      });
      return { success: true, newBalance };
    } else {
      return { success: false, error: 'Student not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Submit project
export const submitProject = async (userId, projectData) => {
  try {
    const projectId = Date.now().toString();
    const projectRef = ref(database, `projects/${userId}/${projectId}`);
    
    await set(projectRef, {
      ...projectData,
      projectId,
      submittedAt: projectData.submittedAt || new Date().toISOString(),
      status: projectData.status || 'completed'
    });
    
    return { success: true, projectId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get student projects
export const getStudentProjects = async (userId) => {
  try {
    const projectsRef = ref(database, `projects/${userId}`);
    const snapshot = await get(projectsRef);
    
    if (snapshot.exists()) {
      const projects = [];
      snapshot.forEach((child) => {
        projects.push({ id: child.key, ...child.val() });
      });
      // Sort by submission date (newest first)
      projects.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      return { success: true, projects };
    } else {
      return { success: true, projects: [] };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get project by ID
export const getProjectById = async (userId, projectId) => {
  try {
    const projectRef = ref(database, `projects/${userId}/${projectId}`);
    const snapshot = await get(projectRef);
    
    if (snapshot.exists()) {
      return { success: true, project: { id: snapshot.key, ...snapshot.val() } };
    } else {
      return { success: false, error: 'Project not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
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
      return { success: false, error: 'Failed to fetch statistics' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
