import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import Dream_ProjectImg from '../assets/Dream_Project.jpeg';
import Wings_of_HopeImg from '../assets/Wings.jpeg';

const imageMap: Record<string, string> = {
  'Dream_Project.jpeg': Dream_ProjectImg,
  'Wings.jpeg': Wings_of_HopeImg,
};

const Projects: React.FC = () => {
  const { data: projects, isLoading } = trpc.project.getAll.useQuery();
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-section fade-in-section" id="programs">
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-6 text-5xl md:text-6xl font-extrabold tracking-tight flex items-center justify-center gap-4">
            Our Projects
          </h1>
          <p className="text-white opacity-90 max-w-3xl mx-auto text-xl md:text-2xl font-medium italic">
            "Every contribution makes a significant impact. Find a cause that resonates with you and help us drive positive change."
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#f8f9fa] fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0" id="goals">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold text-primary mb-4 border-b-2 border-secondary pb-2 inline-block">Projects Of Valmiki Samaj Charitable Trust</h2>
            <p className="text-[16px] text-muted max-w-3xl mx-auto mt-4">Our goals are aligned with our vision of creating an equitable, just, and sustainable society. We focus on areas where we can make the most significant impact, ensuring that our efforts bring about real and lasting change.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
                Loading projects...
              </div>
            ) : !projects || projects.length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
                No projects currently available.
              </div>
            ) : (
              projects.map((project) => {
                const imgSrc = project.image 
                  ? (imageMap[project.image] || project.image)
                  : 'https://via.placeholder.com/400x300?text=No+Image';

                return (
                  <div className="card-basic" key={project.id}>
                    <img alt={project.title} className="card-img" src={imgSrc} />
                    <div className="card-content">
                      <h3 className="card-title">{project.title}</h3>
                      <p className="text-muted-sm whitespace-pre-wrap">{project.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="bg-primary py-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
        <div className="container-main text-center flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-[32px] font-bold text-white mb-4 md:mb-0">Ready to make a difference?</h2>
          <Link to="/contact" className="bg-secondary text-primary px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2">
            <span className="material-symbols-outlined">mail</span> Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Projects;
