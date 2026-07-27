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

const solankiPoints: MemberPoint[] = [
  { icon: 'gavel', title: 'Social Service and Justice', description: 'Remarkable contributions toward the peaceful resolution of social and family disputes through community-based mediation and the Panch Committee system.' },
  { icon: 'volunteer_activism', title: 'Spiritual and Social Activities', description: 'Deeply devoted to spiritual values, religious gatherings, de-addiction initiatives, and promoting social awareness among younger generations.' },
  { icon: 'assignment', title: 'Contributions to the Trust', description: 'Supervises day-to-day activities, mobilizes financial support from donors, coordinates public events, and provides strategic organizational guidance.' }
];

const chauhanPoints: MemberPoint[] = [
  { icon: 'badge', title: 'Professional Service', description: 'Served with honesty, transparency, and a strong sense of public welfare as a Talati-cum-Mantri in Isri and Meghraj for more than 30 years.' },
  { icon: 'self_improvement', title: 'Spiritual Life & Hobbies', description: 'Devoted follower of Jainism practicing non-violence and compassion. Passionate about professional painting, cricket, and sports.' },
  { icon: 'groups', title: 'Community Leadership', description: 'An active leader of the Valmiki community in Meghraj Taluka, dedicated to social service, moral values, and community development.' }
];

const chimanPoints: MemberPoint[] = [
  { icon: 'school', title: 'Educational Contribution', description: 'Completed P.T.C. and served as a dedicated primary school teacher for 38 years, instilling academic knowledge and moral values.' },
  { icon: 'explore', title: 'Professional Locations', description: 'Mainly served in Shamlaji, Modasa, and Jamnagar, dedicating his career to shaping thousands of exemplary citizens.' },
  { icon: 'theater_comedy', title: 'Cultural & Religious Activities', description: 'Actively engaged in cultural, religious, and social awareness programs to foster community togetherness.' }
];

const govindPoints: MemberPoint[] = [
  { icon: 'history_edu', title: 'Creative Expression', description: 'Widely recognized as a talented writer, thoughtful poet, and profound philosopher whose writings inspire humanity, compassion, and resilience.' },
  { icon: 'volunteer_activism', title: 'Selfless Service', description: 'Devoted to social service, treating every individual with equal respect and dignity across both rural and urban communities.' },
  { icon: 'psychology', title: 'Visionary Philosophy', description: 'Believes that true identity is defined by achievements and contributions, inspiring younger generations to seek meaningful action.' }
];

const jayeshPoints: MemberPoint[] = [
  { icon: 'school', title: 'Educational Support', description: 'A graduate in Rural Development serving as a Senior Head Clerk, supporting underprivileged students with school fees, books, and study materials.' },
  { icon: 'payments', title: 'Trust Financial Care', description: 'Treasurer of the Trust carrying out his responsibilities with sincerity, transparency, and personal resource contributions during financial challenges.' },
  { icon: 'volunteer_activism', title: 'Philanthropic Personality', description: 'Known for simplicity, honesty, and compassion, dedicating personal vehicles and resources to support mass marriages and social welfare.' }
];

const bharatPoints: MemberPoint[] = [
  { icon: 'groups', title: 'Social Leadership', description: 'Served as the Panch Patel of the Ada-Aatham region, resolving community issues with fairness, wisdom, and impartiality.' },
  { icon: 'handshake', title: 'Government Welfare Link', description: 'Facilitated government assistance (₹24,000) under Kunwarbai Nu Mameru Yojana and Ramabai Saat Phera Yojana for mass marriage brides.' },
  { icon: 'insights', title: 'Organizational Focus', description: 'Mentors younger generations, coordinates community events, and builds strong trust between the Trust and the community.' }
];

const lalluPoints: MemberPoint[] = [
  { icon: 'grass', title: 'Social Dedication', description: 'Devoted to social service and community welfare, working actively alongside his agricultural occupation.' },
  { icon: 'savings', title: 'Fundraising Excellence', description: 'Possesses exceptional skills in building donor relationships and coordinating fundraising for charitable projects.' },
  { icon: 'self_improvement', title: 'Spiritual Principles', description: 'Guided by humanity, service, humility, and righteousness to strengthen unity and cooperation.' }
];

const vinayPoints: MemberPoint[] = [
  { icon: 'history', title: 'Legacy of Service', description: 'Inherited a noble legacy of community leadership from his late father, Shri Gordhanbhai Rathod, and continues to drive public welfare.' },
  { icon: 'business', title: 'Professional & Education', description: 'Completed his B.A. degree and currently serves professionally with the Life Insurance Corporation of India (LIC) in Modasa.' },
  { icon: 'campaign', title: 'Community Impact', description: 'Recognized for hard work, strong organizational skills, and public speaking, leading key youth and community development programs.' }
];

const sanjayPoints: MemberPoint[] = [
  { icon: 'school', title: 'Academic Credentials', description: 'Highly educated with M.A. (Economics), M.Ed., and B.Ed. degrees, dedicating his expertise to community educational development.' },
  { icon: 'music_note', title: 'Creative & Literary', description: 'A talented singer, public speaker, and writer who uses music and literature to spread values and inspire youth.' },
  { icon: 'analytics', title: 'Financial Audit', description: 'Serves as the Auditor of the Trust, playing an important role in promoting transparency, accountability, and efficient governance.' }
];

const nehalPoints: MemberPoint[] = [
  { icon: 'pets', title: 'Animal Welfare', description: 'Veterinary Officer in Aravalli, treating the protection and treatment of voiceless animals as a moral and spiritual mission.' },
  { icon: 'school', title: 'Education & Devotion', description: 'Nurtured by values of education and discipline, actively supporting mass marriages and poor children\'s education.' },
  { icon: 'campaign', title: 'Youth Leadership', description: 'An energetic leader promoting cleanliness, scientific thinking, and social upliftment within the community.' }
];

export const managementMembers: Member[] = [
  {
    id: 1,
    image: CEO1Img,
    name: 'Shri Narayanbhai M. Rathod',
    role: 'Founder, Coordinator & President',
    quote: '"Every human life deserves dignity, hope, opportunity, and a future."',
    bio: 'Driven by this noble philosophy, Shri Narayan M. Rathod has dedicated his life to bringing education, dignity, self-reliance, and hope to the most vulnerable sections of society. He is a visionary social leader whose unwavering commitment to human welfare continues to inspire countless lives.\n\nA respected social activist, humanitarian thinker, professional photographer, and Founder President of Valmiki Samaj Charitable Trust, Shri Rathod has earned a distinguished reputation for his tireless efforts in uplifting underprivileged, orphaned, and marginalized communities.\n\nA Journey from Compassion to Service\n\nProfessionally trained as a Civil Engineer, Shri Narayan Rathod worked as a successful professional photographer in Surat, Gujarat, from 1985 to 1991. Through the lens of his camera, he witnessed not only faces but also the emotions, struggles, dreams, and realities hidden behind them.\n\nHe firmly believes:\n“A camera captures not only a face but also the story of a life.”\n\nHis deep understanding of human emotions and life experiences nurtured an extraordinary ability to recognize the pain, challenges, and needs of others. This sensitivity became the foundation of his lifelong journey of humanitarian service.\n\nAccording to him:\n“The joy of wiping away someone’s tears is far greater than any material wealth.”\n\nEducation: The Most Powerful Instrument of Social Transformation\n\nShri Narayan Rathod strongly believes that true social progress cannot be achieved solely through economic development. Lasting change comes through education, values, self-respect, and compassion.\n\nHe often says:\n“Education is a lamp that illuminates not only an individual but an entire family, society, and nation.”\n\nGuided by this belief, he continuously works to promote educational opportunities and empower future generations through knowledge and character-building.\n\nDecades of Dedicated Social Service\n\nWith decades of experience in community leadership and social welfare, Shri Narayan Rathod remains remarkably energetic and committed even today.\n\n• Served as District President of Sabarkantha from 2019 to 2021\n• Actively involved in managing charitable trusts, mass marriage initiatives, and social welfare programs since 2012\n• Under his visionary leadership, Valmiki Samaj Charitable Trust has successfully implemented numerous impactful and transformative initiatives.\n\nTransforming Lives Through Mass Marriage Initiatives\n\nBetween 2023 and 2026, Shri Narayan Rathod successfully led and organized four large-scale mass marriage ceremonies across Aravalli District.\n\nThese initiatives enabled the marriage of 50 orphaned and economically disadvantaged daughters, providing them with a dignified beginning to a new chapter of life.\n\nThese events represented far more than marriage ceremonies; they stood as powerful symbols of:\n• Humanity\n• Compassion\n• Social Responsibility\n• Equality\n• Dignity\n\nTo ensure a secure and respectful start to married life, each bride received:\n• Financial support and Kanyadaan assistance\n• Essential household items\n• Home utility materials\n• Daily-life necessities and equipment\n\nWomen Empowerment Through Self-Reliance\n\nShri Narayan Rathod firmly believes:\n“Empowerment is more valuable than dependency.”\n\nFollowing this principle, every newly married daughter was gifted a Singer Sewing Machine, enabling her to become financially independent and contribute to her family’s economic well-being.\n\nHe believes that genuine social service is not merely providing assistance but empowering individuals with confidence, skills, and opportunities to build their own future.\n\nA Symbol of Transparency and Trust\n\nUnder the guidance of Shri Narayan Rathod, Valmiki Samaj Charitable Trust operates with the highest standards of transparency, accountability, and integrity.\n\nThe Trust has received important certifications and registrations, including:\n• 80G Certification\n• 12A Registration\n• CSR-1 Registration\n• NGO Darpan Registration\n\nThese recognitions reflect the organization’s legal compliance, credibility, and unwavering commitment to social welfare.\n\nWhere Spirituality Meets Humanity\n\nA keen student of spiritual wisdom, Shri Narayan Rathod believes that the highest form of worship lies in serving humanity.\n\nHe often states:\n“The satisfaction gained from wiping away the tears of a needy person is greater than the merit earned through any ritual.”\n\nFor him, human service is the purest expression of faith, and compassion is the highest form of devotion.\n\nIntegrity, Courage, and Principled Leadership\n\nShri Narayan Rathod is widely respected for his honesty, fearlessness, and commitment to truth.\n\nThroughout his public life, he has remained steadfast in:\n• Upholding Truth\n• Supporting Justice\n• Promoting Transparency\n• Protecting Human Dignity\n\nHis clear vision, ethical leadership, and straightforward communication have earned him deep respect across diverse sections of society.\n\nA Vision for Orphaned Children\n\nOne of Shri Narayan Rathod’s most cherished dreams is to ensure that no orphaned child is deprived of education, opportunities, or values due to financial hardship or unfortunate circumstances.\n\nHe actively advocates for:\n• Child sponsorship and adoption support\n• Quality education for underprivileged children\n• Character development and life skills\n• Building responsible and compassionate citizens\n\nHe believes:\n“When every child is given an opportunity, they become not only the architect of their own destiny but also the builder of society’s future.”\n\nA Family Dedicated to Education and Service\n\nThe Rathod family exemplifies a tradition of education, values, and social commitment.\n\n• His wife, Smt. Manjulaben Rathod, is a retired teacher who devoted her career to nurturing knowledge and character among countless students.\n• His daughter Roshniben and son-in-law Shri Rasikkumar serve as school teachers, contributing to nation-building through education.\n• His elder son Shri Falgunkumar Rathod and his wife Dharmisthaben as teacher are also educators, while his younger son Dr. Nehal Rathod serves as a Veterinary Surgeon and actively contributes to the Trust as a Trustee.\n• Together, the family continues to uphold the values of education, compassion, service, and social responsibility.\n\n“A family that embraces education and service as its core values contributes to a brighter future for society.”\n\nLife Philosophy\n\n“May my life become an offering,\nMay it become food for the hungry,\nAnd water for the thirsty.”\n\nThese words are not merely a prayer; they reflect the essence of Shri Narayan Rathod’s life and mission.\n\nHe has transformed his life into a humble offering dedicated to humanity, working tirelessly to bring hope, dignity, education, and self-respect to those who need it most.\n\nOne Mission. One Commitment.\n\n“Building an Educated, Cultured, Self-Reliant, and Compassionate Society.”\n\nWith this vision, Shri Narayan M. Rathod continues to serve society with dedication and purpose.\n\nHis life teaches us that true success is not measured by what we achieve for ourselves, but by the positive impact we create in the lives of others.\n\n“Where humanity thrives, the presence of God is truly felt.”\n\n• Profession: Civil Engineer\n• Role: Founder President & Chief Coordinator\n• Active Since: 2012\n• Sabarkantha District President: 2019 - 2021\n• Major Projects: Organized 4 mass marriage ceremonies (2023-2026) for 50 daughters',
    points: typeAPoints,
    tag: 'Registered Trust: F/1968/Aravalli'
  },
  {
    id: 2,
    image: CEO2Img,
    name: 'Dr. Bhikhabhai K. Solanki',
    role: 'Honorary Secretary',
    quote: '"Together, we can create a world where every individual thrives and contributes to a brighter future."',
    bio: 'Dr. Bhikhabhai Koderbhai Solanki has been dedicated to social service, humanitarian welfare, and the upliftment of the Valmiki community for over two decades. He has made significant contributions toward the welfare of underprivileged families, widowed women, and orphaned girls, working tirelessly to improve their quality of life and provide them with opportunities for a brighter future.\n\nHe has played a vital role in the successful organization of community mass marriage ceremonies, enabling many deserving young women to begin a new chapter of life with dignity and respect. He firmly believes that true social service lies in bringing hope, confidence, and self-respect into the lives of those in need.\n\nAs a member of the Social Justice Committee of Modasa Taluka Panchayat, he has rendered commendable public service. His active efforts have helped ensure that the benefits of various government welfare schemes reach deserving individuals and families.\n\nServing as the General Secretary of the Valmiki Samaj Charitable Trust, he provides dynamic leadership in the Trust’s social, educational, and welfare initiatives. Known as an influential speaker, skilled organizer, and dedicated social worker, he enjoys immense respect and recognition within the community.\n\nDr. Bhikhabhai Solanki’s life stands as an inspiring example of selfless service, compassion, and unwavering commitment to society. His journey of service reflects the highest values of humanity, dedication, and public welfare, inspiring others to contribute toward the betterment of society.\n\n• Native Place: Rakhiyal, Taluka Modasa, District Aravalli\n• Date of Birth: 01 June 1970',
    points: typeBPoints,
    tag: 'Core Management Team'
  },
  {
    id: 3,
    image: CEO3Img,
    name: 'Mr. Poonambhai L. Solanki',
    role: 'Chairman',
    quote: '"True justice is the foundation of peace, unity, and harmony in society."',
    bio: 'Mr. Poonambhai Lalabhai Solanki is a respected community leader, social reformer, and a source of inspiration for society. He has been serving as the Mahant of the Malpur–Aniyor region and has dedicated his life to promoting unity, justice, and social harmony within the community.\n\nKnown for his wisdom, fairness, and commitment to social welfare, he has played a significant role in resolving community disputes through the traditional Panch system. His impartial and just decisions have helped maintain peace, mutual understanding, and strong social bonds among community members.\n\nHe firmly believes that:\n"True justice is the foundation of peace, unity, and harmony in society."\n\nSocial Service and Justice\n\nMr. Solanki has made remarkable contributions toward the peaceful resolution of social and family disputes. Through community-based mediation and the Panch Committee system, he has successfully resolved numerous issues before they reached police stations or courts.\n\nHis efforts have fostered an atmosphere of transparency, fairness, brotherhood, and mutual respect within the community. Under his guidance, many individuals and families have received timely and satisfactory resolutions to their concerns.\n\nSpiritual and Social Activities\n\nDeeply devoted to spiritual values, Mr. Solanki actively participates in devotional singing, religious gatherings, and community spiritual programs. He is a strong advocate of de-addiction initiatives, the eradication of harmful social practices, and the promotion of social awareness.\n\nHe continuously encourages younger generations to embrace spirituality, moral values, and community service. His life\'s mission is to inspire positive social change and promote the principles of humanity, compassion, and ethical living.\n\nContributions to the Trust\n\nAs a senior mentor and Chairman of the Valmiki Samaj Charitable Trust, Mr. Solanki has successfully undertaken several important responsibilities, including:\n• Supervising and overseeing the day-to-day activities of the Trust.\n• Mobilizing financial support and contributions from donors and well-wishers.\n• Coordinating public events, social programs, and community gatherings.\n• Providing strategic guidance to trustees and members on organizational matters.\n• Working closely with the Trust\'s team to achieve sustainable growth and community development.\n\nLeadership and Personality\n\nMr. Poonambhai Solanki is recognized as a capable, visionary, and effective leader. Through his leadership, he has built a strong bridge between the community and the Trust, helping the organization reach new milestones of progress and success.\n\nHis cheerful nature, approachable personality, and excellent organizational skills have earned him immense respect throughout the community. Under his guidance, the values of cooperation, dedication, service, and unity have flourished within the organization.\n\nHe strongly believes that:\n"Service to society is the highest form of duty."\n\nThrough his actions and lifelong commitment, he continues to embody and inspire this noble principle.\n\n• Date of Birth: 01 June 1952\n• Residence: Malpur Village & Post, Taluka Malpur, District Aravalli, Gujarat, India\n• Profession: Retired Government Employee\n• Social Responsibility: Community Leader of the Malpur–Aniyor Region',
    points: solankiPoints,
    tag: 'Core Management Team'
  },
  {
    id: 4,
    image: CEO4Img,
    name: 'Mr. Dineshbhai B. Chauhan',
    role: 'Vice Chairman',
    quote: '"Together, we can create a world where every individual thrives and contributes to a brighter future."',
    bio: 'Mr. Dineshbhai Bhurabhai Chauhan is a religious, service-oriented, and multi-talented personality. As an active leader of the Valmiki community in Meghraj Taluka, he has dedicated his life to social service, moral values, and spiritual growth.\n\nHe served with honesty, transparency, and a strong sense of public welfare as a Talati-cum-Mantri in Isri and Meghraj for more than 30 years. Even after retirement, he continues to actively contribute to community development as the Vice Chairman of Valmiki Samaj Charitable Trust.\n\n• Date of Birth: 01 June 1964\n• Address: Village & Post Meghraj, District Aravalli, Gujarat\n• Occupation: Talati-cum-Mantri, Isri & Meghraj (Retired Government Officer)\n• Hobbies: Professional Painting, Cricket, and various sports',
    points: chauhanPoints,
    tag: 'Core Management Team'
  },
  {
    id: 5,
    image: CEO5Img,
    name: 'Mr. Chimanbhai S. Solanki',
    role: 'Vice President',
    quote: '"Every human life deserves dignity, hope, opportunity, and a future."',
    bio: 'Mr. Chimanbhai Somabhai Solanki is a respected, educated, and socially devoted leader. He has dedicated his life to personal growth and the overall development of society. Through his hard work, dedication, and commitment, he has played a significant role in shaping thousands of students into responsible and exemplary citizens of the nation.\n\nHe completed his P.T.C. and served as a primary school teacher for 38 years. He mainly served in Shamlaji, Modasa, and Jamnagar. As an educator, he not only imparted academic knowledge but also instilled moral values, cultural awareness, and social responsibility among his students. Even after retirement, he continues to remain actively involved in social service.\n\n• Age: 62 years\n• Native Place: Sayra, Taluka Modasa\n• Current Residence: Sarvodaya Nagar, Modasa',
    points: chimanPoints,
    tag: 'Core Management Team'
  },
  {
    id: 6,
    image: CEO6Img,
    name: 'Mr. Govindbhai A. Solanki',
    role: 'Personality and Life Philosophy',
    quote: '"What truly defines us is not where or how we were born, but what we accomplish and contribute throughout our lives."',
    bio: 'Mr. Govindbhai Alkhabhai Solanki’s life is a remarkable blend of perseverance, courage, creativity, and selfless service to society. Born into humble circumstances, he rose above numerous challenges through unwavering determination, relentless hard work, and a positive outlook on life. He firmly believes that a person\'s true identity is defined not by their birthplace or circumstances, but by their achievements, values, and contributions to society.\n\nBeyond his dedication to social service, Govindbhai is widely recognized as a talented writer, a thoughtful poet, and a profound philosopher. His writings go beyond words; they inspire humanity, compassion, resilience, and a deeper understanding of life’s values. Through his essays, reflections, and poetry, he ignites hope, confidence, and social awareness in the hearts of his readers.\n\nHis humble nature, noble character, and unwavering commitment to the welfare of others make him a source of inspiration for people from all walks of life. Whether in rural communities or urban settings, he treats every individual with equal respect and dignity. His visionary thinking, creative expression, and spirit of selfless service continue to enrich society and elevate the true meaning of community leadership.\n\nAt the core of his philosophy lies a powerful belief:\n“Through consistent effort and perseverance, it is possible to create something meaningful from nothing. There is no substitute for relentless hard work in achieving success. What truly defines us is not where or how we were born, but what we accomplish and contribute throughout our lives.”\n\n• Role: Personality and Life Philosophy\n• Talents: Writing, Poetry, Philosophy',
    points: govindPoints,
    tag: 'Core Management Team'
  },
  {
    id: 7,
    image: CEO7Img,
    name: 'Shri Jayeshbhai N. Rathod',
    role: 'Treasurer',
    quote: '"True wealth is not measured by material possessions, but by the ability to bring hope, support, and happiness into the lives of others."',
    bio: 'Shri Jayeshbhai Nathabhai Rathod is a graduate in Rural Development, currently serving as a Senior Head Clerk at Shri N. U. Bihola High School, Isari. His dedication to educational administration, discipline, and responsibility has earned him a reputation as a dependable and highly efficient professional.\n\nHis passion for education extends beyond his professional role. He has become a beacon of hope for underprivileged, orphaned, and economically disadvantaged students by supporting their educational needs. Through assistance with school fees, books, uniforms, study materials, and coaching facilities, he has played a significant role in shaping brighter futures for many young learners. His efforts have opened new opportunities for countless students to pursue quality education and achieve academic success.\n\nSocial Service and Dedication to the Trust\n\nShri Jayeshbhai serves as the Treasurer of the Aravalli Valmiki Samaj Charitable Trust, where he carries out his responsibilities with sincerity, transparency, and unwavering commitment. He actively participates in all service-oriented initiatives and consistently places the welfare of the Trust and the community above personal interests.\n\nWhenever the Trust faces financial challenges or requires additional support, he generously contributes from his own resources to ensure that its activities continue without interruption. His generosity, integrity, and sense of responsibility have made him a strong pillar of support for the organization.\n\nHe is also deeply involved in community events, mass marriage ceremonies, and various social welfare programs. On many occasions, he voluntarily dedicates his personal vehicle and resources to support charitable activities and ensure the smooth execution of community initiatives. For him, service is not merely a responsibility—it is a way of life.\n\nPersonality and Values\n\nShri Jayeshbhai is known for his cheerful, free-spirited, and warm-hearted personality. His simplicity, honesty, loyalty, compassion, and humanity have earned him immense respect and admiration within the community. He treats everyone with dignity and kindness, making him a beloved and trusted figure among people from all walks of life.\n\nPhilanthropy is at the heart of his character. He firmly believes that true wealth is not measured by material possessions, but by the ability to bring hope, support, and happiness into the lives of others. His selfless service, commitment to education, and tireless efforts toward social upliftment have established him as an inspiring humanitarian and a dedicated community leader.\n\n“Guided by the values of service, education, and humanity, Shri Jayeshbhai Rathod continues to work tirelessly for the welfare of society and the brighter future of generations to come.”\n\n• Age: 53 Years\n• Native Place: Isari, Meghraj Taluka, Aravalli District\n• Current Residence: Pokhraj Park Society, Modasa, Aravalli',
    points: jayeshPoints,
    tag: 'Core Management Team'
  },
  {
    id: 8,
    image: CEO8Img,
    name: 'Shri Bharatbhai M. Rathod',
    role: 'Organizational Secretary',
    quote: '"Service to Humanity is Service to God."',
    bio: 'Shri Bharatbhai M. Rathod is a dedicated and respected social worker actively involved in community service, organizational development, devotional activities, and sports. He is known for his commitment, leadership, and tireless efforts toward the welfare and advancement of society.\n\nA fearless, conscious, and enthusiastic individual, Shri Bharatbhai consistently takes the initiative in community development activities. Through innovative ideas and constructive efforts, he strives to inspire positive change and guide the younger generation toward a meaningful and responsible future.\n\nSocial Vision and Leadership\n\nThe guiding principle of Shri Bharatbhai Rathod’s life is:\n“Unity is strengthened through dialogue, understanding, and cooperation.”\n\nAs the Panch Patel of the Ada-Aatham region, he has played a significant role in resolving numerous social and community issues with fairness, wisdom, and impartiality. His leadership has helped strengthen harmony, mutual respect, and unity within the community.\n\nHe serves as a vital link between the Valmiki Samaj Charitable Trust and the community, promoting transparency, coordination, and collective progress.\n\nKey Strengths and Contributions\n\n• Strong ability to resolve social and community issues with courage and practical wisdom.\n• Continuous efforts to promote unity, brotherhood, and cooperation within society.\n• Inspiring and mentoring young people through positive guidance and motivation.\n• Skilled in organizing community events, meetings, and cultural programs.\n• Building strong trust and effective coordination between the Trust and the community.\n• Dedicated to social empowerment and inclusive community development.\n\nCommitment and Service to the Trust\n\nAs the Organizational Secretary of the Valmiki Samaj Charitable Trust, Aravalli, Shri Bharatbhai Rathod performs his responsibilities with honesty, transparency, and unwavering dedication.\n\nDuring all three community mass marriage ceremonies organized by the Trust, he played a leading role in ensuring that orphaned and economically disadvantaged brides received benefits under government welfare schemes such as Kunwarbai Nu Mameru Yojana and Ramabai Saat Phera Yojana. Through his efforts, many eligible beneficiaries received direct financial assistance of up to ₹24,000, reflecting his deep compassion and commitment to humanitarian service.\n\nJourney of Service and Future Vision\n\nFor Shri Bharatbhai Rathod, social service is not merely a responsibility—it is a lifelong mission and a form of spiritual devotion.\n\nLooking ahead, he is committed to supporting orphaned, underprivileged, and destitute children by providing access to shelter, education, moral values, and opportunities for a brighter future through the initiatives of the Trust.\n\nHis vision is to ensure that every child of the Valmiki community becomes educated, self-reliant, self-respecting, and culturally grounded. Through youth development and community welfare programs, he continues to work toward building a progressive, empowered, and united society.\n\nInspirational Thought\n\n“Service to Humanity is Service to God.”\n\nGuided by this noble belief, Shri Bharatbhai M. Rathod continues to inspire society through his lifelong dedication, leadership, and unwavering commitment to community service.\n\n• Residence: Tintoi, Taluka Modasa, District Aravalli, Gujarat, India\n• Age: 63 Years',
    points: bharatPoints,
    tag: 'Core Management Team'
  },
  {
    id: 9,
    image: CEO9Img,
    name: 'Mr. Lallubhai C. Solanki',
    role: 'Vice Secretary',
    quote: '"True service is the greatest wealth."',
    bio: 'Mr. Lallubhai Chandubhai Solanki is a simple, service-oriented, and spiritually enriched personality who has dedicated himself to the welfare and overall development of society. Along with agriculture, he actively participates in various social service activities and continuously works for the betterment of the community.\n\nAs a loyal and dedicated Vice Secretary of Valmiki Samaj Charitable Trust, he plays a significant role in the Trust’s various initiatives and activities. His gentle speech, courteous nature, and warm relationships with people have earned him great respect and popularity within the community.\n\nHe possesses exceptional skills in fundraising and building strong relationships with donors. His effective communication abilities and unwavering commitment to social welfare have helped many charitable projects achieve success.\n\nA treasure of spiritual values, Mr. Lallubhai believes in living a life guided by humanity, service, humility, and righteousness. He consistently works to strengthen the spirit of unity, cooperation, and compassion within society.\n\nHis life conveys a simple yet inspiring message:\n“True service is the greatest wealth.”\n\nHis dedication, trustworthiness, and love for society make him a source of inspiration for the entire Valmiki community.\n\n• Date of Birth: 02 May 1966\n• Occupation: Agriculture and Social Service\n• Position: Vice Secretary – Valmiki Samaj Charitable Trust',
    points: lalluPoints,
    tag: 'Core Management Team'
  },
  {
    id: 10,
    image: CEO10Img,
    name: 'Mr. Vinaykumar G. Rathod',
    role: 'Joint Secretary',
    quote: '"Through continued service and dedication, we carry forward the noble legacy of our predecessors for the betterment of society."',
    bio: 'Mr. Vinaykumar Gordhanbhai Rathod was born on July 11, 1979, into a family deeply rooted in social service, community leadership, and public welfare. He completed his Bachelor of Arts (B.A.) degree and is currently serving with the Life Insurance Corporation of India (LIC), Modasa.\n\nThe values of dedication, leadership, and service were inherited from his father, Late Shri Gordhanbhai Rathod, a highly respected social leader, politician, scholar, and renowned public speaker. Throughout his life, Late Shri Gordhanbhai Rathod rendered exceptional services to the community through various social organizations and held several prestigious positions, including that of Chief Patron. He was affectionately known throughout the community by the name “Mastana” and earned immense respect for his vision, wisdom, and commitment to social upliftment.\n\nFollowing the demise of his father, Mr. Vinaykumar Rathod assumed the responsibility entrusted to him within the Valmiki Samaj Charitable Trust. He has carried forward this legacy with dedication, sincerity, and a strong sense of responsibility toward society.\n\nSocial service is a shared commitment of the entire Rathod family. Every family member actively participates in community welfare initiatives and contributes meaningfully to various social and charitable activities. Mr. Vinaykumar himself plays a vital role in almost every major community program and development initiative.\n\nKnown for his hard work, organizational abilities, and effective public speaking skills, Mr. Vinaykumar reflects many of the admirable qualities that distinguished his father. Despite his relatively young age, he has earned a respected place within the community and is widely recognized for his contributions to social development and community welfare.\n\nHis unwavering commitment to education, social unity, and the progress of society has established him as a trusted and influential community leader. Through his continued service and dedication, Mr. Vinaykumar Gordhanbhai Rathod remains an inspiration to the younger generation, carrying forward the noble legacy of his predecessors while working tirelessly for the betterment of society.\n\n• Date of Birth: 11 July 1979\n• Education: Bachelor of Arts (B.A.)\n• Profession: Life Insurance Corporation of India (LIC), Modasa\n• Position: Vice Secretary – Valmiki Samaj Charitable Trust',
    points: vinayPoints,
    tag: 'Core Management Team'
  },
  {
    id: 11,
    image: CEO11Img,
    name: 'Mr. Sanjaykumar J. Solanki',
    role: 'Auditor',
    quote: '"Transparency, accountability, and dedication are the keys to building a trusted and progressive society."',
    bio: 'Mr. Sanjaykumar Jagdishbhai Solanki is an energetic, progressive, and multi-talented young social worker. He has made significant contributions in the fields of education, social service, literature, and cultural activities.\n\nHe is a highly educated individual who actively works to spread awareness, promote education, strengthen social unity, and inspire positive change through various community awareness programs.\n\nAs a talented singer, he uses music as a medium to spread messages of inspiration, values, and social awareness. He is also a skilled public speaker and literary writer, known for guiding and motivating the younger generation through his thoughts, speeches, and writings.\n\nAs the Auditor of Valmiki Samaj Charitable Trust, he plays an important role in strengthening the Trust by promoting transparency, accountability, and an efficient system of governance.\n\nHis personality reflects a remarkable combination of knowledge, creativity, leadership, social service, and youthful energy, making him a true source of inspiration for the entire community.\n\n• Date of Birth: 03 May 1986\n• Educational Qualifications: M.A. (Economics), M.Ed., B.Ed.\n• Position: Auditor – Valmiki Samaj Charitable Trust',
    points: sanjayPoints,
    tag: 'Core Management Team'
  },
  {
    id: 12,
    image: CEO12Img,
    name: 'Dr. Nehal Kumar N. Rathod',
    role: 'Veterinary Officer & Youth Leader',
    quote: '"Cleanliness leads to education, and education leads to development."',
    bio: 'Dr. Nehal Kumar Rathod is a veterinary doctor by profession and a true humanitarian by heart. Dedicated to the welfare of both people and voiceless animals, he has devoted his life to service, compassion, and care.\n\nServing as a Veterinary Officer in Aravalli District, he considers the protection and treatment of animals not merely a professional responsibility but a moral and spiritual mission.\n“God resides in every living being.”\nThis belief serves as the guiding principle of his life.\n\nFamily Background and Inspiration\n\nDr. Nehal Kumar Rathod is the son of Mr. Narayanlal Rathod, a respected Civil Engineer and the distinguished President of the Valmiki Samaj Charitable Trust.\n\nHis mother, a retired teacher, nurtured in him the values of education, discipline, compassion, and cultural heritage from an early age.\n\nInspired by his father\'s lifelong commitment to social service, Dr. Rathod developed a deep sense of empathy toward the underprivileged and a passion for serving humanity—qualities that continue to define his character today.\n\nA Life Dedicated to Humanity and Animal Welfare\n\nFor Dr. Nehal Rathod, service is not merely a profession; it is a form of worship.\n\nAlongside his veterinary responsibilities, he actively participates in various humanitarian initiatives, including community marriages for economically disadvantaged families, educational assistance for needy children, social awareness programs, and community development activities.\n\nHis work reflects a unique blend of kindness, compassion, love, and selfless service.\n\nYouth Leadership and Spiritual Vision\n\nBorn on 25 June 1991, Dr. Rathod chose the path of service and leadership from a young age.\n\nHe firmly believes that true spirituality is found not only in places of worship but also in serving and uplifting living beings.\n\n“Cleanliness leads to education, and education leads to development.”\nThis principle serves as his lifelong motto.\n\nAssociation with Valmiki Samaj Charitable Trust\n\nIn 2025, Dr. Nehal Kumar Rathod joined the Valmiki Samaj Charitable Trust as a dynamic and energetic young member, marking a proud moment for the organization.\n\nHis enthusiasm, scientific outlook, and spiritual values have contributed significantly to the Trust’s mission and vision.\n\nHe remains actively involved in initiatives such as mass marriages for orphaned and underprivileged daughters, educational support for poor children, and the overall social upliftment of the community.\n\nVision for the Future\n\nDr. Nehal Kumar Rathod dreams of an India where—\n• Every child has access to quality education,\n• No person sleeps hungry,\n• And the Valmiki community progresses from cleanliness toward education, empowerment, and sustainable development.\n\nHis life stands as a shining example that service to humanity and animals is the highest form of religion, and that compassion, love, humanity, and spirituality are the true foundations of a meaningful life.\n\n“My life is my message.”\n— The words of Mahatma Gandhi perfectly reflect the life, values, and mission of Dr. Nehal Kumar Rathod.\n\n• Date of Birth: 25 June 1991\n• Qualifications: B.V.Sc. & A.H. (Veterinary Doctor)\n• Position: Veterinary Officer & Youth Leader',
    points: nehalPoints,
    tag: 'Core Management Team'
  }
];
