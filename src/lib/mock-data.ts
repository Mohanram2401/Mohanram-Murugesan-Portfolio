import type { Certification, Education, Experience, Project, Skill } from "./types";

export const mockProjects: Project[] = [
  {
    id: "m-1",
    title: "Enterprise Wazuh SIEM Implementation & Security Automation",
    description:
      "Centralized security monitoring integrating Active Directory, Bitdefender EDR, VirusTotal, and n8n workflows.",
    longDescription:
      "Implemented Wazuh SIEM for centralized security monitoring. Developed custom rules and decoders to improve threat detection and alert visibility. Extended monitoring capabilities by orchestrating API lookups through VirusTotal, automating incident responses using n8n workflows, and dispatching real-time notifications to Slack channels.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Security", "Automation", "SIEM"],
    tech: ["Wazuh", "Active Directory", "Bitdefender EDR", "VirusTotal", "n8n", "Slack"],
    githubUrl: "https://github.com/Mohanram2401",
    featured: true,
    order: 1,
  },
  {
    id: "m-2",
    title: "Zabbix + pfSense Lab for DDoS Detection & Automated Notification",
    description:
      "Network gateway monitoring environment mapping traffic surges with automated email alerting.",
    longDescription:
      "Configured a pfSense gateway and Zabbix server in a dedicated home-lab environment to monitor high inbound traffic and detect potential DDoS attacks. Integrated advanced triggers and automated email alerts to improve incident readiness and response times.",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    tags: ["Networking", "Monitoring"],
    tech: ["pfSense", "Zabbix", "DDoS Defenses", "Email Alerts"],
    githubUrl: "https://github.com/Mohanram2401",
    featured: true,
    order: 2,
  },
  {
    id: "m-3",
    title: "Packet Ranger – Wireshark Traffic Analysis Lab",
    description:
      "Packet capture detonation analyzing packet exchanges, latencies, and TCP retransmissions.",
    longDescription:
      "Captured and analyzed local and internet traffic exchanges between virtual machines using Wireshark. Identified performance bottlenecks, latency anomalies, and TCP retransmissions, and compiled technical findings reports.",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tags: ["Analysis", "Network"],
    tech: ["Wireshark", "VMware", "TCP/IP Analysis", "Traffic Auditing"],
    githubUrl: "https://github.com/Mohanram2401",
    order: 3,
  },
  {
    id: "m-4",
    title: "Ransomware Detection Tool",
    description:
      "Malware scanning and mitigation tool leveraging YARA rules, RK-Hunter, and traffic analysis.",
    longDescription:
      "Developed a custom ransomware detection tool in a sandboxed Kali Linux environment. Integrated custom YARA rules for signature-based malware pattern matching, utilized RK-Hunter for rootkit detection, and leveraged Wireshark to analyze network traffic patterns for lateral movement signals.",
    image:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
    tags: ["OffSec", "Malware"],
    tech: ["Kali Linux", "YARA Rules", "RK-Hunter", "Wireshark", "Bash"],
    githubUrl: "https://github.com/Mohanram2401",
    order: 4,
  },
];

export const mockSkills: Skill[] = [
  // Programming
  { id: "s-1", name: "Java", category: "Frontend", level: 75, order: 1 },
  { id: "s-2", name: "Bash", category: "Frontend", level: 65, order: 2 },
  // Databases
  { id: "s-3", name: "MongoDB", category: "Database", level: 80, order: 3 },
  { id: "s-4", name: "Firebase", category: "Database", level: 82, order: 4 },
  { id: "s-5", name: "MySQL", category: "Database", level: 70, order: 5 },
  { id: "s-6", name: "KQL", category: "Database", level: 60, order: 6 },
  // Security / Tools
  { id: "s-7", name: "Wazuh", category: "Security", level: 92, order: 7 },
  { id: "s-8", name: "Zabbix", category: "Security", level: 88, order: 8 },
  { id: "s-9", name: "pfSense", category: "Security", level: 85, order: 9 },
  { id: "s-10", name: "n8n", category: "Tools", level: 80, order: 10 },
  { id: "s-11", name: "Bitdefender", category: "Security", level: 84, order: 11 },
  { id: "s-12", name: "SecPod Saner", category: "Security", level: 82, order: 12 },
  { id: "s-13", name: "Wireshark", category: "Tools", level: 88, order: 13 },
  { id: "s-14", name: "VAPT", category: "Security", level: 80, order: 14 },
];

export const mockExperience: Experience[] = [
  {
    id: "e-1",
    role: "Graduate Engineer Trainee — Cybersecurity & IT Projects",
    company: "TVS Electronics Ltd",
    location: "Chennai, Tamil Nadu",
    startDate: "Jun 2025",
    endDate: "Present",
    bullets: [
      "Implemented and customized Wazuh SIEM, integrating Active Directory, Bitdefender EDR, and security logs for centralized threat detection.",
      "Received recognition from the Vice President of TVS Electronics for outstanding contributions to the Wazuh SIEM deployment.",
      "Monitored security events in SOC/NOC environments using Wazuh, Bitdefender, SecPod Saner, and Zabbix.",
      "Performed Vulnerability Assessment and Penetration Testing (VAPT) on internal/external web applications.",
      "Automated reporting workflows and business processes utilizing Microsoft Forms and Power Automate.",
      "Supported retail IT operations including store deployments, server setups, and internal attendance portal development.",
    ],
    order: 1,
  },
];

export const mockEducation: Education[] = [
  {
    id: "ed-1",
    degree: "B.Tech in Information Technology",
    institution: "Kongu Engineering College",
    startDate: "Sep 2022",
    endDate: "May 2025",
    details: "GPA: 7.63/10. Coursework: Database Management Systems, Data Analytics, Software Engineering, Network Security. Completed academic projects in Ransomware Detection, E-Commerce.",
    order: 1,
  },
  {
    id: "ed-2",
    degree: "Diploma in Electrical and Electronics Engineering",
    institution: "Kongu Polytechnic College",
    startDate: "Jun 2019",
    endDate: "Jun 2022",
    details: "Percentage: 94%. Developed a Smart Medicine Pick and Place Robot using Microcontroller 8060 and Bluetooth technology.",
    order: 2,
  },
  {
    id: "ed-3",
    degree: "Secondary School Leaving Certificate (SSLC)",
    institution: "Reliance Matric Higher Secondary School",
    startDate: "Apr 2018",
    endDate: "Apr 2019",
    details: "Percentage: 67.4%. Erode, Tamil Nadu.",
    order: 3,
  },
];

export const mockCertifications: Certification[] = [
  {
    id: "c-1",
    name: "Certified Ethical Hacker (CEH)",
    issuer: "EC-Council",
    issuedDate: "Currently Pursuing",
    credentialUrl: "https://www.eccouncil.org",
    order: 1,
  },
  {
    id: "c-2",
    name: "Ethical Hacker Certification",
    issuer: "Cisco",
    issuedDate: "2024",
    credentialUrl: "https://www.cisco.com",
    order: 2,
  },
  {
    id: "c-3",
    name: "Introduction to Cybersecurity",
    issuer: "Cisco",
    issuedDate: "2024",
    credentialUrl: "https://www.cisco.com",
    order: 3,
  },
  {
    id: "c-4",
    name: "Junior Cybersecurity Analyst",
    issuer: "Cisco",
    issuedDate: "2024",
    credentialUrl: "https://www.cisco.com",
    order: 4,
  },
];

export const mockData = {
  projects: mockProjects,
  skills: mockSkills,
  experience: mockExperience,
  education: mockEducation,
  certifications: mockCertifications,
};
