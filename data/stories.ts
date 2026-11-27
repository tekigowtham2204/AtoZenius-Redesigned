export type StoryTrack = 'All' | 'Medical Coding' | 'Python Full Stack' | 'Java Full Stack';

export interface StudentStory {
  id: string;
  name: string;
  initials: string;
  track: Exclude<StoryTrack, 'All'>;
  outcome: string;
  quote: string;
}

export const storyTracks: StoryTrack[] = [
  'All',
  'Medical Coding',
  'Python Full Stack',
  'Java Full Stack',
];

export const studentStories: StudentStory[] = [
  {
    id: 'mukul-chowdary',
    name: 'Mukul Chowdary',
    initials: 'MC',
    track: 'Medical Coding',
    outcome: 'Medical Coding & CPC Prep Graduate',
    quote:
      'I successfully completed my Medical Coding course at AtoZenius. A special thanks to Sai Ram Sir for his excellent teaching and guidance. ICD-10-CM, HCPCS and CPT topics were taught in a very interesting and easy-to-understand way. His support helped me gain confidence for the CPC exam.',
  },
  {
    id: 'saranya-b',
    name: 'Saranya B',
    initials: 'SB',
    track: 'Java Full Stack',
    outcome: 'Placed via AtoZenius Placement Training',
    quote:
      'I completed my Java Full Stack course and upgraded my skills. The placement training they gave me was really helpful in landing a job in the HR sector.',
  },
  {
    id: 'siva-yarra',
    name: 'Siva Yarra',
    initials: 'SY',
    track: 'Python Full Stack',
    outcome: 'Python Full Stack Internship Graduate',
    quote:
      "AtoZenius's Python Full Stack internship was a transformational journey for me. The learning environment was supportive, and mentors were approachable at every step.",
  },
  {
    id: 'sarvani-n',
    name: 'Sarvani N',
    initials: 'SN',
    track: 'Python Full Stack',
    outcome: 'Dual Internship Completer & Placed',
    quote:
      'The mentors teach really well. I also completed two internships which were helpful for my resume, and I have since landed a good job.',
  },
  {
    id: 'kalyan-karadi',
    name: 'Kalyan Karadi',
    initials: 'KK',
    track: 'Python Full Stack',
    outcome: 'Course & Internship Certified',
    quote:
      'I learned the Python Full Stack course and earned an internship completion certificate. Front end was the most interesting part. I recommend AtoZenius.',
  },
  {
    id: 'pavankumar-buttala',
    name: 'Pavankumar Buttala',
    initials: 'PB',
    track: 'Python Full Stack',
    outcome: 'Course & Internship Certified',
    quote:
      "I joined the Python Full Stack course at AtoZenius. It's good, I received my course and internship completion certificates, and the mentors are very supportive.",
  },
  {
    id: 'shaheensha',
    name: 'Shaheensha',
    initials: 'S',
    track: 'Java Full Stack',
    outcome: 'Java Full Stack Graduate',
    quote:
      'I completed the Java Full Stack course at AtoZenius Pvt. Ltd. The trainers were supportive, the classes were practical, and I gained valuable knowledge in Java Full Stack development.',
  },
  {
    id: 'yaswanth-sai',
    name: 'Yaswanth Sai',
    initials: 'YS',
    track: 'Python Full Stack',
    outcome: 'Python Full Stack Learner',
    quote:
      "I learned Python Full Stack here. It's really easy to understand and the mentors cleared doubts with good explanations.",
  },
  {
    id: 'amaan-md',
    name: 'Amaan Md',
    initials: 'AM',
    track: 'Python Full Stack',
    outcome: 'Mentor-Guided Upskilling Graduate',
    quote:
      'Very helpful and within my budget. I was lucky to get good mentors and learn so much in such a short time.',
  },
  {
    id: 'venkatesh',
    name: 'Venkatesh',
    initials: 'V',
    track: 'Medical Coding',
    outcome: 'Medical Coding & Internship Certified',
    quote:
      'Completed my Medical Coding course and received my course and internship completion certificates. It really helped boost my CV. Thank you.',
  },
];
