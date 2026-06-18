import React from 'react';
import { Link } from 'react-router-dom';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

const AboutUs: React.FC = () => {
  useFadeInOnScroll();

  return (
    <div className="page-section fade-in-section overflow-x-hidden w-full" id="about-us">
      {/* About Header */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            About Us
          </h1>
          <p className="text-white opacity-90 max-w-3xl mx-auto text-xl md:text-2xl font-medium italic">
            "Every human life deserves dignity, hope, opportunity, and a future."
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full border border-white/20 shadow-lg text-sm md:text-base mx-auto w-fit max-w-full">
             <span className="text-secondary font-bold">Our Motto:</span> <span>"Service to Humanity is Service to God."</span>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container-main">
          
          {/* Trust Identity & Origin */}
          <div className="mb-24 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="flex-1 order-2 lg:order-1">
                <h2 className="text-[28px] md:text-[36px] font-bold text-primary mb-8 border-l-4 border-secondary pl-4 leading-tight">Valmiki Samaj Charitable Trust</h2>
                
                <div className="bg-[#f8f9fa] card-content p-5 md:p-8 rounded-2xl border border-gray-100 mb-10 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-secondary/10 p-3 rounded-xl text-secondary"><span className="material-symbols-outlined text-[24px]">receipt_long</span></div>
                      <div>
                        <p className="text-[12px] text-gray-500 font-bold uppercase tracking-wider mb-1">Registration No.</p>
                        <p className="text-primary font-bold text-[15px]">F/1968/Aravalli</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-secondary/10 p-3 rounded-xl text-secondary"><span className="material-symbols-outlined text-[24px]">event</span></div>
                      <div>
                        <p className="text-[12px] text-gray-500 font-bold uppercase tracking-wider mb-1">Established</p>
                        <p className="text-primary font-bold text-[15px]">24 January 2020</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:col-span-2 mt-2 pt-6 border-t border-gray-200">
                      <div className="bg-secondary/10 p-3 rounded-xl text-secondary"><span className="material-symbols-outlined text-[24px]">person_check</span></div>
                      <div>
                        <p className="text-[12px] text-gray-500 font-bold uppercase tracking-wider mb-1">Founder, Coordinator & President</p>
                        <p className="text-primary font-bold text-xl">Shri Narayanbhai M. Rathod</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Link to="/certifications" className="inline-flex items-center gap-2 bg-[#e67e22] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] hover:bg-[#d67b00] transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">verified</span> Explore More / View Certifications
                    </Link>
                  </div>
                </div>

                <div className="space-y-6 text-[#45464e] text-[17px] leading-relaxed">
                  <p>
                    <strong className="text-primary">Valmiki Samaj Charitable Trust. Where there is service, humanity comes alive; where there is education, a brighter future is created.
In the happiness of others lies our happiness; in the welfare of others lies our welfare; and in the progress of others lies our pride.</strong> is more than just a charitable organization—it is a mission born from compassion, humanity, and the deep pain of witnessing the struggles faced by countless poor, orphaned, widowed, and underprivileged families.
                  </p>
                  <p>
                  Inspired by this divine life philosophy, Valmiki Samaj Charitable Trust is a dedicated charitable organization committed to social welfare, human service, and holistic community development. Guided by the noble values of service, education, moral values, and dedication, the Trust strives to bring hope, dignity, confidence, and opportunities for progress to the lives of the poor, underprivileged, orphaned, destitute, and needy.</p>
                  <p>
                 We firmly believe that education is not merely a means of acquiring knowledge, but the most powerful tool to combat poverty, inequality, and ignorance. Therefore, through our “Education Mission – Education is Welfare” initiative, we continuously work to provide quality education to every child, promote educational awareness, reconnect school dropouts with learning opportunities, and encourage higher education. Our commitment is to ensure that no child is deprived of education due to economic or social circumstances. </p>
                  <p className="text-secondary font-bold text-lg">
                    Valmiki Samaj Charitable Trust was created to stand beside such people—not as spectators to their suffering, but as partners in their journey toward hope, dignity, and self-reliance.
                  </p>
                  <p>
                  One of the Trust’s primary objectives is to provide orphaned and destitute children with safe shelter, nutritious food, quality education, healthcare, and a value-based environment that nurtures their overall development. Our goal extends beyond providing care; we aim to shape these children into educated, responsible, ethical, and patriotic citizens who can contribute meaningfully to society and the nation.
To support orphaned, destitute, and economically disadvantaged girls, the Trust organizes community marriage ceremonies that enable them to begin a dignified new chapter in life. Along with essential household items and generous marriage assistance, every bride is provided with a sewing machine. This initiative helps them become financially independent through self-employment and serves as a powerful example of women’s empowerment. Our objective is not only to conduct marriages but also to empower women with the means to build a secure and self-reliant future.
Inspired by the ideals of service, compassion, humanity, and dedication exemplified by His Holiness Pramukh Swami Maharaj, along with the values of Indian culture and patriotism, the Trust works to promote unity, social harmony, ethical living, education, and civic responsibility. Our vision is not limited to a single community; rather, it embraces the welfare of all sections of society and the broader cause of humanity.
“Service is our faith, education is our mission, values are our identity, and dedication is our strength.”  
                  </p>
                </div>
              </div>
              
              <div className="lg:w-[450px] shrink-0 order-1 lg:order-2 lg:sticky lg:top-8 w-full">
                <div className="relative group mx-auto max-w-[280px] sm:max-w-[350px] lg:max-w-none">
                  <div className="absolute inset-0 bg-secondary rounded-[2rem] transform translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                  <img alt="Valmiki Samaj Trust Logo" className="w-full h-auto rounded-[2rem] shadow-2xl border-4 sm:border-8 border-white relative z-10 bg-white p-6 sm:p-8 md:p-12 object-contain aspect-square" src="/logo.jpg" />
                  
                  {/* Decorative element */}
                  <div className="absolute -bottom-6 -left-6 bg-primary text-white card-content rounded-2xl shadow-xl z-20 w-56 hidden md:block border-2 border-white/10 backdrop-blur-md">
                    <p className="font-bold text-4xl text-secondary mb-1">100%</p>
                    <p className="text-[13px] text-gray-300 font-medium leading-tight">Committed to lasting transformation and empowerment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Commitments */}
          <div className="mb-24 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
            <div className="text-center mb-16">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Areas of Focus</span>
              <h2 className="text-[28px] md:text-[36px] font-bold text-primary">Our Deepest Commitments</h2>
              <div className="w-24 h-1.5 bg-secondary mx-auto mt-6 rounded-full"></div>
              <p className="max-w-3xl mx-auto text-muted mt-6 text-[17px] leading-relaxed">
                We believe that charity should not merely provide temporary relief; it should create lasting transformation. Our efforts focus on empowering individuals through targeted humanitarian support and skill development.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {/* Card 1 */}
              <div className="bg-[#f8f9fa] p-8 md:p-10 rounded-3xl hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 border-t-4 border-transparent hover:border-secondary group">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-8 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl">child_care</span>
                </div>
                <h3 className="text-[24px] font-bold text-primary mb-4">Nurturing Children</h3>
                <p className="text-[#45464e] leading-relaxed text-[16px]">
                  No child should suffer because of circumstances beyond their control. We work to ensure orphaned, destitute, and disadvantaged children receive education, healthcare, nutrition, and guidance. Our long-term goal includes establishing an orphanage, residential school, sports facilities, and development centers.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#f8f9fa] p-8 md:p-10 rounded-3xl hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 border-t-4 border-transparent hover:border-secondary group">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-8 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl">family_restroom</span>
                </div>
                <h3 className="text-[24px] font-bold text-primary mb-4">Supporting Vulnerable Families</h3>
                <p className="text-[#45464e] leading-relaxed text-[16px]">
                  We are equally committed to supporting widows, elderly individuals, sanitation workers, and laborers. Through food assistance, healthcare, emergency relief, and livelihood opportunities, we strive to restore confidence and hope in the lives of those who need it most.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#f8f9fa] p-8 md:p-10 rounded-3xl hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 border-t-4 border-transparent hover:border-secondary group">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-8 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl">health_and_safety</span>
                </div>
                <h3 className="text-[24px] font-bold text-primary mb-4">Health & Human Dignity</h3>
                <p className="text-[#45464e] leading-relaxed text-[16px]">
                  Health remains at the heart of our mission. No individual should lose their life due to unsafe working conditions, poor sanitation, preventable diseases, or lack of medical care. Through health camps, safety initiatives, and welfare support, we protect community well-being.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[#f8f9fa] p-8 md:p-10 rounded-3xl hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 border-t-4 border-transparent hover:border-secondary group">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-8 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl">school</span>
                </div>
                <h3 className="text-[24px] font-bold text-primary mb-4">Empowerment & Growth</h3>
                <p className="text-[#45464e] leading-relaxed text-[16px]">
                  True social change requires empowerment. We promote skill development, vocational training, women's empowerment, self-employment opportunities, and leadership development. Our goal is not simply to help people survive but to help them thrive.
                </p>
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="mb-24 bg-primary rounded-[2.5rem] p-6 sm:p-8 md:p-14 lg:p-16 text-white relative overflow-hidden fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/3">
                <h2 className="text-[28px] sm:text-[36px] md:text-[46px] font-bold text-white mb-6 leading-tight">Our Vision for the Future</h2>
                <div className="w-20 h-1.5 bg-secondary mb-8 rounded-full"></div>
                <p className="text-gray-300 text-[18px] leading-relaxed">
                  Our vision extends beyond addressing immediate needs. We dream of building a society free from fear, discrimination, and deprivation. We envision a future where:
                </p>
              </div>
              
              <div className="lg:w-2/3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                  {[
                    "No poor person goes to bed hungry.",
                    "No child is deprived of education because of poverty.",
                    "No widow is left without support and dignity.",
                    "No family is trapped in the cycle of helplessness.",
                    "No young person loses hope due to unemployment.",
                    "No life is endangered by unsafe and degrading working conditions.",
                    "Every individual receives equal opportunities for growth and success."
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-secondary/20 rounded-full p-2 mt-0.5 shrink-0">
                        <span className="material-symbols-outlined text-secondary text-[18px] font-bold">check</span>
                      </div>
                      <p className="text-gray-100 font-medium text-[16px] leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-24 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
            <div className="text-center mb-16">
              <h2 className="text-[28px] md:text-[36px] font-bold text-primary">The Foundation of Our Projects</h2>
              <div className="w-24 h-1.5 bg-secondary mx-auto mt-6 rounded-full mb-6"></div>
              <p className="text-muted text-[17px] max-w-2xl mx-auto">
                These principles form the foundation of every project we undertake. We ensure every contribution is utilized responsibly and effectively to create meaningful impact.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-[#f8f9fa] p-6 sm:p-8 rounded-2xl text-center border-b-4 border-secondary hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-primary">visibility</span>
                </div>
                <h3 className="text-[20px] font-bold text-primary">Transparency</h3>
              </div>
              <div className="bg-[#f8f9fa] p-6 sm:p-8 rounded-2xl text-center border-b-4 border-secondary hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-primary">fact_check</span>
                </div>
                <h3 className="text-[20px] font-bold text-primary">Accountability</h3>
              </div>
              <div className="bg-[#f8f9fa] p-6 sm:p-8 rounded-2xl text-center border-b-4 border-secondary hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-primary">gavel</span>
                </div>
                <h3 className="text-[20px] font-bold text-primary">Integrity</h3>
              </div>
              <div className="bg-[#f8f9fa] p-6 sm:p-8 rounded-2xl text-center border-b-4 border-secondary hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-primary">volunteer_activism</span>
                </div>
                <h3 className="text-[20px] font-bold text-primary">Compassion</h3>
              </div>
            </div>
          </div>

          {/* Our Promise & Join Us CTA */}
          <div className="bg-[#f8f9fa] rounded-[2.5rem] p-6 sm:p-8 md:p-16 border border-gray-100 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 shadow-sm relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md mb-8">
                <span className="material-symbols-outlined text-4xl text-secondary">workspace_premium</span>
              </div>
              <h2 className="text-[28px] md:text-[36px] font-bold text-primary mb-8">Our Promise</h2>
              <p className="text-[22px] md:text-[26px] text-primary leading-relaxed mb-12 italic font-medium px-4">
                "We will continue working until every child can dream without fear, every widow can live with dignity, every family can stand on its own feet, and every human being can experience the respect, opportunity, and hope they deserve."
              </p>
              
              <div className="h-px w-full max-w-2xl mx-auto bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-12"></div>
              
              <h3 className="text-[24px] md:text-[30px] font-bold text-primary mb-6">Join Our Journey</h3>
              <p className="text-muted text-[18px] mb-12 leading-relaxed px-4 md:px-12">
                As we continue our journey, we invite compassionate individuals, volunteers, donors, institutions, and partners to join hands with us. At <strong className="text-primary">Valmiki Samaj Charitable Trust</strong>, we do not simply serve people—we stand with them, believe in them, and walk beside them until they can confidently build a brighter future for themselves and generations to come.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link to="/donate" className="bg-secondary text-white font-bold py-4 px-10 rounded-full hover:bg-[#d67b00] transition-all duration-300 shadow-[0_8px_20px_rgba(237,137,1,0.3)] hover:shadow-[0_12px_25px_rgba(237,137,1,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 text-[16px]">
                  <span className="material-symbols-outlined">volunteer_activism</span> Support Our Cause
                </Link>
                <Link to="/contact" className="bg-white text-primary font-bold py-4 px-10 rounded-full hover:bg-gray-50 border-2 border-primary/10 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 flex items-center justify-center gap-2 text-[16px]">
                  <span className="material-symbols-outlined">handshake</span> Partner With Us
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default AboutUs;

