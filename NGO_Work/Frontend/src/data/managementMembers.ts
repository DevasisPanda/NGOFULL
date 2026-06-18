import CEO1Img from '../assets/CEO1.jpeg';
import CEO2Img from '../assets/CEO2.jpeg';
import CEO3Img from '../assets/CEO3.jpeg';
import CEO4Img from '../assets/CEO4.jpeg';
import CEO5Img from '../assets/CEO5.jpeg';
import CEO6Img from '../assets/CEO6.jpeg';
import CEO7Img from '../assets/CEO7.jpeg';
import CEO8Img from '../assets/CEO8.jpeg';
import CEO9Img from '../assets/CEO9.jpeg';
import CEO10Img from '../assets/CEO10.jpeg';
import CEO11Img from '../assets/CEO11.jpeg';
import CEO12Img from '../assets/CEO12.jpeg';

export interface MemberPoint {
  icon: string;
  title: string;
  description: string;
}

export interface Member {
  id: number;
  image: string;
  name: string;
  role: string;
  quote: string;
  bio: string;
  points: MemberPoint[];
  tag: string;
}

const typeAPoints: MemberPoint[] = [
  { icon: 'visibility', title: 'Visionary Leadership', description: 'Dedicated to building a society free from poverty and discrimination, focusing on long-term transformation rather than temporary relief.' },
  { icon: 'handshake', title: 'Commitment to the Vulnerable', description: 'Working tirelessly for orphaned children, widows, sanitation workers, and marginalized families to restore their confidence and dignity.' }
];

const typeBPoints: MemberPoint[] = [
  { icon: 'group', title: 'Community Building', description: 'Fostering strong relationships within the community to build a network of support and empowerment for the marginalized.' },
  { icon: 'insights', title: 'Strategic Growth', description: 'Guiding the trust\'s expansion and optimizing resources to maximize impact across all ongoing projects.' }
];

export const managementMembers: Member[] = [
  {
    id: 1,
    image: CEO1Img,
    name: 'Shri Narayanbhai M. Rathod',
    role: 'Founder, Coordinator & President',
    quote: '"Every human life deserves dignity, hope, opportunity, and a future."',
    bio: 'Driven by deep compassion and a profound understanding of the struggles faced by the underprivileged, Shri Narayanbhai M. Rathod established the Valmiki Samaj Charitable Trust on January 24, 2020.',
    points: typeAPoints,
    tag: 'Registered Trust: F/1968/Aravalli'
  },
  {
    id: 2,
    image: CEO2Img,
    name: 'Dr. Bhikhabhai K. Solanki',
    role: 'Honorary Secretary',
    quote: '"Together, we can create a world where every individual thrives and contributes to a brighter future."',
    bio: 'A highly dedicated professional committed to the core values of the Valmiki Samaj Charitable Trust, driving strategic initiatives and ensuring the efficient execution of all community programs.',
    points: typeBPoints,
    tag: 'Core Management Team'
  },
  {
    id: 3,
    image: CEO3Img,
    name: 'Mr. Poonambhai L. Solanki',
    role: 'Chairman',
    quote: '"Every human life deserves dignity, hope, opportunity, and a future."',
    bio: 'Driven by deep compassion and a profound understanding of the struggles faced by the underprivileged, Shri Narayanbhai M. Rathod established the Valmiki Samaj Charitable Trust on January 24, 2020.',
    points: typeAPoints,
    tag: 'Registered Trust: F/1968/Aravalli'
  },
  {
    id: 4,
    image: CEO4Img,
    name: 'Mr. Dineshbhai B. Chauhani',
    role: 'Vice Chairman',
    quote: '"Together, we can create a world where every individual thrives and contributes to a brighter future."',
    bio: 'A highly dedicated professional committed to the core values of the Valmiki Samaj Charitable Trust, driving strategic initiatives and ensuring the efficient execution of all community programs.',
    points: typeBPoints,
    tag: 'Core Management Team'
  },
  {
    id: 5,
    image: CEO5Img,
    name: 'Mr. Chimanbhai S. Solanki',
    role: 'Vice President',
    quote: '"Every human life deserves dignity, hope, opportunity, and a future."',
    bio: 'Driven by deep compassion and a profound understanding of the struggles faced by the underprivileged, Shri Narayanbhai M. Rathod established the Valmiki Samaj Charitable Trust on January 24, 2020.',
    points: typeAPoints,
    tag: 'Registered Trust: F/1968/Aravalli'
  },
  {
    id: 6,
    image: CEO6Img,
    name: 'Mr. Govindbhai A. Solanki',
    role: 'Personality and Life Philosophy',
    quote: '"Together, we can create a world where every individual thrives and contributes to a brighter future."',
    bio: 'A highly dedicated professional committed to the core values of the Valmiki Samaj Charitable Trust, driving strategic initiatives and ensuring the efficient execution of all community programs.',
    points: typeBPoints,
    tag: 'Core Management Team'
  },
  {
    id: 7,
    image: CEO7Img,
    name: 'Shri Jayeshbhai N. Rathod',
    role: 'Treasurer',
    quote: '"Every human life deserves dignity, hope, opportunity, and a future."',
    bio: 'Driven by deep compassion and a profound understanding of the struggles faced by the underprivileged, Shri Narayanbhai M. Rathod established the Valmiki Samaj Charitable Trust on January 24, 2020.',
    points: typeAPoints,
    tag: 'Registered Trust: F/1968/Aravalli'
  },
  {
    id: 8,
    image: CEO8Img,
    name: 'Shri Bharatbhai M. Rathod',
    role: 'Organizational Secretary',
    quote: '"Together, we can create a world where every individual thrives and contributes to a brighter future."',
    bio: 'A highly dedicated professional committed to the core values of the Valmiki Samaj Charitable Trust, driving strategic initiatives and ensuring the efficient execution of all community programs.',
    points: typeBPoints,
    tag: 'Core Management Team'
  },
  {
    id: 9,
    image: CEO9Img,
    name: 'Mr. Lallubhai C. Solanki',
    role: 'Vice Secretary',
    quote: '"Every human life deserves dignity, hope, opportunity, and a future."',
    bio: 'Driven by deep compassion and a profound understanding of the struggles faced by the underprivileged, Shri Narayanbhai M. Rathod established the Valmiki Samaj Charitable Trust on January 24, 2020.',
    points: typeAPoints,
    tag: 'Registered Trust: F/1968/Aravalli'
  },
  {
    id: 10,
    image: CEO10Img,
    name: 'Mr. Vinaykumar G. Rathod',
    role: 'Joint Secretary',
    quote: '"Together, we can create a world where every individual thrives and contributes to a brighter future."',
    bio: 'A highly dedicated professional committed to the core values of the Valmiki Samaj Charitable Trust, driving strategic initiatives and ensuring the efficient execution of all community programs.',
    points: typeBPoints,
    tag: 'Core Management Team'
  },
  {
    id: 11,
    image: CEO11Img,
    name: 'New Member 11',
    role: 'Executive Member',
    quote: '"Every human life deserves dignity, hope, opportunity, and a future."',
    bio: 'A dedicated member contributing to the ongoing mission of the trust.',
    points: typeAPoints,
    tag: 'Core Management Team'
  },
  {
    id: 12,
    image: CEO12Img,
    name: 'New Member 12',
    role: 'Executive Member',
    quote: '"Together, we can create a world where every individual thrives and contributes to a brighter future."',
    bio: 'A dedicated member contributing to the ongoing mission of the trust.',
    points: typeBPoints,
    tag: 'Core Management Team'
  }
];
