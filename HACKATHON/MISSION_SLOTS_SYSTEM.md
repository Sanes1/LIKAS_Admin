# Mission Slots System - Implementation Guide

## Problem
Currently, when a student completes a mission, the mission data is being overwritten/cleared, causing:
1. Loss of original mission data (title, description, tags, postedBy)
2. Mission still appears in student's available missions list
3. No tracking of how many students have completed the mission vs. available slots

## Solution: Proper Slot Management System

### Database Structure Changes Needed

#### 1. Project Document Structure
```javascript
{
  id: "project123",
  title: "Mission Title",
  description: "Mission description",
  tags: [...],
  postedBy: {...},
  category: "Biology",
  
  // Slot management
  slots: 3,                    // Total slots available (from Post a Need)
  slotsRemaining: 3,           // Remaining slots
  assignedStudents: [],        // Array of student IDs currently working
  completedStudents: [],       // Array of student IDs who completed
  
  // Status logic
  status: "matching",          // matching, active, completed, full
  
  // Preserve original data
  originalData: {              // Backup of original mission data
    title: "...",
    description: "...",
    tags: [...],
    postedBy: {...}
  }
}
```

#### 2. Submissions Collection (Separate from Projects)
```javascript
// Collection: submissions
{
  id: "submission123",
  projectId: "project123",
  studentId: "student456",
  studentName: "Juan Dela Cruz",
  studentEmail: "juan@email.com",
  
  // Submission data
  answers: [...],
  fileName: "submission.pdf",
  submittedAt: timestamp,
  reviewedAt: timestamp,
  status: "pending" | "approved" | "rejected",
  
  // Mission snapshot (for reference)
  missionTitle: "...",
  missionTags: [...]
}
```

### LGU Side Changes (This Repo)

#### 1. Update `createProject` in firebaseService.js
```javascript
export const createProject = async (projectData) => {
  const projectsRef = collection(db, 'projects');
  const docRef = await addDoc(projectsRef, {
    ...projectData,
    slotsRemaining: projectData.slots || 1,
    assignedStudents: [],
    completedStudents: [],
    originalData: {
      title: projectData.title,
      description: projectData.description,
      tags: projectData.tags,
      postedBy: projectData.postedBy,
      category: projectData.category
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: 'matching'
  });
  return docRef.id;
};
```

#### 2. Add Slot Management Functions
```javascript
export const assignStudentToMission = async (projectId, studentId) => {
  const projectRef = doc(db, 'projects', projectId);
  const project = await getProject(projectId);
  
  if (project.slotsRemaining <= 0) {
    throw new Error("No slots remaining");
  }
  
  await updateDoc(projectRef, {
    assignedStudents: [...project.assignedStudents, studentId],
    slotsRemaining: project.slotsRemaining - 1,
    status: project.slotsRemaining - 1 === 0 ? 'full' : 'active',
    updatedAt: serverTimestamp()
  });
};

export const completeStudentMission = async (projectId, studentId) => {
  const projectRef = doc(db, 'projects', projectId);
  const project = await getProject(projectId);
  
  // Remove from assigned, add to completed
  const updatedAssigned = project.assignedStudents.filter(id => id !== studentId);
  const updatedCompleted = [...project.completedStudents, studentId];
  
  // Check if all slots are completed
  const allCompleted = updatedCompleted.length >= project.slots;
  
  await updateDoc(projectRef, {
    assignedStudents: updatedAssigned,
    completedStudents: updatedCompleted,
    status: allCompleted ? 'completed' : 'active',
    updatedAt: serverTimestamp()
  });
};
```

### Student Side Changes (Separate Repo)

#### 1. When Student Accepts Mission
```javascript
// DO NOT modify the project document directly
// Instead, call the LGU's assignStudentToMission function
await assignStudentToMission(projectId, currentStudentId);
```

#### 2. When Student Completes Mission
```javascript
// Create submission in submissions collection
const submissionRef = collection(db, 'submissions');
await addDoc(submissionRef, {
  projectId: projectId,
  studentId: currentStudentId,
  studentName: currentStudent.name,
  // ... submission data
  submittedAt: serverTimestamp()
});

// Update project slots (DO NOT overwrite project data)
await completeStudentMission(projectId, currentStudentId);
```

#### 3. Filter Available Missions
```javascript
// STUDENT SIDE - When displaying available missions to students
const availableMissions = projects.filter(p => {
  // 1. Hide completed missions (all slots filled)
  if (p.status === 'completed') return false;
  
  // 2. Hide full missions (no slots remaining)
  if (p.status === 'full') return false;
  
  // 3. Hide if student already completed this mission
  if (p.completedStudents?.includes(currentStudentId)) return false;
  
  // 4. Hide if student already accepted/working on this mission
  if (p.assignedStudents?.includes(currentStudentId)) return false;
  
  // 5. Only show matching or active missions with available slots
  return (p.status === 'matching' || p.status === 'active') && 
         (p.slotsRemaining > 0 || p.slotsRemaining === undefined);
});

// Display these filtered missions to the student
console.log(`Showing ${availableMissions.length} available missions to student`);
```

**Key Points:**
- When a mission reaches its slot limit, `status` becomes `'completed'`
- The mission will be filtered out and disappear from the student's available missions list
- Students who already completed a mission won't see it again (checked via `completedStudents` array)
- Students who are currently working on a mission won't see it in available missions (checked via `assignedStudents` array)

### Display Logic Updates

#### Dashboard & All Missions
```javascript
// Always use originalData as fallback
const displayTitle = project.title || project.originalData?.title || "Untitled";
const displayTags = project.tags || project.originalData?.tags || [];
const displayPostedBy = project.postedBy || project.originalData?.postedBy || null;
const displayDescription = project.description || project.originalData?.description || "";

// Show slot status
const slotStatus = `${project.completedStudents?.length || 0}/${project.slots} completed`;
```

## Implementation Priority

1. **CRITICAL**: Add `originalData` backup to all new missions
2. **CRITICAL**: Separate submissions into their own collection
3. **HIGH**: Implement slot management functions
4. **HIGH**: Update student-side code to use slot functions
5. **MEDIUM**: Update display logic to use originalData fallback
6. **LOW**: Migrate existing completed missions (data recovery)

## Migration Script for Existing Data

For missions that already lost their data, you'll need to manually restore from Firebase backups or accept the data loss. Going forward, the `originalData` field will prevent this issue.
