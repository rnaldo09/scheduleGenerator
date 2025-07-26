import { Day } from "./types"

export const timeRequirement = {
        day: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        classDuration: 135,
        breakDuration: 15,
        startTime: '07:00',
        endTime: '17:00',
        conditions: [
            'friday|!=|12:00'
        ],
        maxCoursesPerDay: 2
    }

export const classSubject = [
      {
        subjectCode: "IF101",
        subjectName: "Dasar Pemrograman",
        roomType: "Teori",
      },
      {
        subjectCode: "IF102",
        subjectName: "Praktikum Dasar Pemrograman",
        roomType: "Lab Komputer",
      },
      {
        subjectCode: "IF201",
        subjectName: "Struktur Data",
        roomType: "Teori",
      },
      {
        subjectCode: "IF202",
        subjectName: "Basis Data",
        roomType: "Teori",
      },
      {
        subjectCode: "IF203",
        subjectName: "Praktikum Basis Data",
        roomType: "Lab Komputer",
      },
      {
        subjectCode: "KU101",
        subjectName: "Kalkulus I",
        roomType: "Teori",
      },
      {
        subjectCode: "KU105",
        subjectName: "Bahasa Inggris I",
        roomType: "Teori",
      },
      {
        subjectCode: "SI301",
        subjectName: "Analisis & Desain Sistem",
        roomType: "Teori",
      },
      {
        subjectCode: "IF301",
        subjectName: "Pemrograman Lanjut",
        roomType: "Teori",
      },
      {
        subjectCode: "IF302",
        subjectName: "Praktikum Pemrograman Lanjut",
        roomType: "Lab Komputer",
      },
      {
        subjectCode: "KU110",
        subjectName: "Statistika",
        roomType: "Teori",
      },
      {
        subjectCode: "SI302",
        subjectName: "Manajemen Proyek Sistem Informasi",
        roomType: "Teori",
      }
    ]

export const lecturer = [
      {
        lecturerId: "D001",
        lecturerName: "Dr. Budi Santoso",
        subject: ["IF101", "IF102", 'IF201'],
        availability: ["monday", "tuesday", "wednesday"] as Day[],
        conditions: [
            "monday|=|morning",
            "tuesday|=|morning"
        ]
      },
      {
        lecturerId: "D002",
        lecturerName: "Prof. Siti Aminah",
        subject: ["IF202", 'IF203', 'SI301'],
        availability: ["monday", "tuesday", "thursday"] as Day[],
        conditions: [
            "monday|=|afternoon"
        ]
      },
      {
        lecturerId: "D003",
        lecturerName: "Ir. Ahmad Yani",
        subject: ['KU101'],
        availability: ["monday", "wednesday", "friday"] as Day[],
        conditions: [
            "friday|=|morning"
        ]
      },
      {
        lecturerId: "D004",
        lecturerName: "Drs. Rina Hartati",
        subject: ['KU105'],
        availability: ["tuesday", "thursday"] as Day[],
        conditions: [
            "tuesday|=|morning",
            "thursday|=|morning"
        ]
      },
      {
        lecturerId: "D005",
        lecturerName: "Dr. Joko Susilo",
        subject: ['IF101', 'IF102', 'IF202'],
        availability: ["monday", "wednesday", "friday"] as Day[],
        conditions: [
            "wednesday|=|morning"
        ]
      },
      {
        lecturerId: "D006",
        lecturerName: "Dr. Lina Marlina",
        subject: ["IF301", "IF302"],
        availability: ["tuesday", "wednesday", "thursday"] as Day[],
        conditions: [
          "tuesday|=|afternoon",
          "thursday|=|morning"
        ],
      },
      {
        lecturerId: "D007",
        lecturerName: "Prof. Agus Santoso",
        subject: ["KU110", "SI302"],
        availability: ["monday", "friday"] as Day[],
        conditions: [
          "monday|=|morning",
          "friday|=|afternoon"
        ],
      }
    ]

export const room = [
      {
        roomCode: "R301",
        roomName: "Ruang Teori 301",
        capacity: 50,
        roomType: "Teori",
        facility: ["Proyektor", "AC"],
      },
      {
        roomCode: "R302",
        roomName: "Ruang Teori 302",
        capacity: 50,
        roomType: "Teori",
        facility: ["Proyektor", "AC"],
      },
      {
        roomCode: "R405",
        roomName: "Ruang Teori 405",
        capacity: 40,
        roomType: "Teori",
        facility: ["Proyektor"],
      },
      {
        roomCode: "LAB-A",
        roomName: "Lab Komputer A",
        capacity: 30,
        roomType: "Lab Komputer",
        facility: ["Proyektor", "AC", "Komputer"],
      },
      {
        roomCode: "LAB-B",
        roomName: "Lab Komputer B",
        capacity: 30,
        roomType: "Lab Komputer",
        facility: ["Proyektor", "Komputer"],
      }
    ]

export const studentMajor = [
      {
        batchId: "IF24A",
        batchName: "Informatika 24 A",
        major: "Informatika",
        batch: 2024,
        amount: 45,
        subjectEnroll: ['IF101', 'IF102', 'KU101', 'KU105'] 
      },
      {
        batchId: "IF24B",
        batchName: "Informatika 24 B",
        major: "Informatika",
        batch: 2024,
        amount: 48,
        subjectEnroll: ['IF101', 'IF102', 'KU101', 'KU105']
      },
      {
        batchId: "IF23A",
        batchName: "Informatika 23 A",
        major: "Informatika",
        batch: 2023,
        amount: 40,
        subjectEnroll: ['IF201', 'IF202', 'IF203']
      },
      {
        batchId: "SI24A",
        batchName: "Sistem Informasi 24A",
        major: "Sistem Informasi",
        batch: 2024,
        amount: 35,
        subjectEnroll: ['SI301', 'KU101']
      },
      {
        batchId: "IF25A",
        batchName: "Informatika 25 A",
        major: "Informatika",
        batch: 2025,
        amount: 50,
        subjectEnroll: ['IF301', 'IF302', 'KU110']
      },
      {
        batchId: "SI25A",
        batchName: "Sistem Informasi 25 A",
        major: "Sistem Informasi",
        batch: 2025,
        amount: 40,
        subjectEnroll: ['SI302', 'KU110']
      }
    ]