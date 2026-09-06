// In-memory data store for StudyTrack

let subjects = [
  {
    id: 1,
    name: "React Development",
    description: "Learning React fundamentals, components, state management, and hooks",
    progress: 75
  },
  {
    id: 2,
    name: "Data Structures",
    description: "Mastering arrays, trees, graphs, sorting, and search algorithms",
    progress: 60
  },
  {
    id: 3,
    name: "Database Management",
    description: "Relational database concepts, SQL queries, indexing, and normalizing data",
    progress: 80
  },
  {
    id: 4,
    name: "Computer Networks",
    description: "Understanding OSI layers, TCP/IP, routing protocols, and HTTP header specs",
    progress: 40
  },
  {
    id: 5,
    name: "Web Development",
    description: "HTML5 semantic markup, CSS Grid, responsive design, and DOM manipulation",
    progress: 90
  }
];

let tasks = [
  {
    id: 1,
    title: "Complete React Assignment",
    description: "Build a multi-step form app with custom validation hooks",
    subject: "React Development",
    priority: "High",
    dueDate: "2026-09-06",
    completed: false
  },
  {
    id: 2,
    title: "Practice Binary Trees",
    description: "Implement in-order, pre-order, and post-order traversal methods",
    subject: "Data Structures",
    priority: "Medium",
    dueDate: "2026-09-06",
    completed: true
  },
  {
    id: 3,
    title: "Study SQL Joins",
    description: "Write sample INNER, LEFT, RIGHT, and FULL OUTER joins",
    subject: "Database Management",
    priority: "Low",
    dueDate: "2026-09-12",
    completed: true
  },
  {
    id: 4,
    title: "Prepare TCP/IP Notes",
    description: "Summarize handshake mechanism, flow control, and windowing",
    subject: "Computer Networks",
    priority: "High",
    dueDate: "2026-09-08",
    completed: false
  },
  {
    id: 5,
    title: "Build CSS Layout",
    description: "Create a modern 3-column responsive dashboard mockup",
    subject: "Web Development",
    priority: "Medium",
    dueDate: "2026-09-06",
    completed: true
  }
];

let sessions = [
  {
    id: 1,
    subject: "React Development",
    topic: "React Hooks",
    date: "2026-09-06",
    startTime: "18:00",
    duration: 45,
    completed: false
  },
  {
    id: 2,
    subject: "Data Structures",
    topic: "Binary Trees",
    date: "2026-09-07",
    startTime: "10:00",
    duration: 60,
    completed: false
  },
  {
    id: 3,
    subject: "Database Management",
    topic: "SQL Joins",
    date: "2026-09-08",
    startTime: "14:00",
    duration: 30,
    completed: true
  },
  {
    id: 4,
    subject: "Computer Networks",
    topic: "TCP/IP",
    date: "2026-09-09",
    startTime: "16:00",
    duration: 45,
    completed: false
  },
  {
    id: 5,
    subject: "Web Development",
    topic: "CSS Flexbox",
    date: "2026-09-10",
    startTime: "11:00",
    duration: 60,
    completed: true
  }
];

let nextSubjectId = 6;
let nextTaskId = 6;
let nextSessionId = 6;

module.exports = {
  subjects,
  tasks,
  sessions,
  getNextSubjectId: () => nextSubjectId++,
  getNextTaskId: () => nextTaskId++,
  getNextSessionId: () => nextSessionId++
};
