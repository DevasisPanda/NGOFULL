import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { format } from 'date-fns';

const Events: React.FC = () => {
  const { data: events, isLoading } = trpc.event.getActive.useQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Statuses');

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
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

  const filteredEvents = events?.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-section fade-in-section" id="programs">
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10 px-4">
          <h1 className="text-secondary mb-6 text-5xl md:text-6xl font-extrabold tracking-tight flex items-center justify-center gap-4 text-center">
            Programs & Events
          </h1>
          <p className="max-w-3xl mx-auto text-xl md:text-2xl font-medium italic text-white">
            "Discover our programs and join our community events to be a part of the change we're making."
          </p>
        </div>
      </section>

      <section className="container-main -mt-12 mb-12 relative z-20 px-4">
        <div className="bg-white rounded-xl shadow-lg border border-[#c5c6cf] card-content md:p-8 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-6">
              <label className="block text-sm font-bold text-[#1a1c1c] mb-2">Search Programs & Events</label>
              <div className="flex">
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 min-w-0 border-[#c5c6cf] focus:border-primary focus:ring-primary rounded-l-lg bg-[#f3f3f4] text-[#1a1c1c] py-2.5 px-4 outline-none border" 
                  placeholder="Search by title or description..." 
                  type="text"
                />
                <button className="bg-primary text-white px-6 rounded-r-lg hover:opacity-90 transition-all flex items-center gap-2 font-bold whitespace-nowrap">
                  <span className="material-symbols-outlined text-xl">search</span> Search
                </button>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-[#1a1c1c] mb-2">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none border border-[#c5c6cf] focus:border-primary focus:ring-primary rounded-lg bg-[#f3f3f4] text-[#1a1c1c] py-2.5 px-4 outline-none"
                >
                  <option>All Categories</option>
                  <option>Education</option>
                  <option>Health</option>
                  <option>Spirituality</option>
                  <option>Environment</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#45464e]">expand_more</span>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-[#1a1c1c] mb-2">Status</label>
              <div className="relative">
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none border border-[#c5c6cf] focus:border-primary focus:ring-primary rounded-lg bg-[#f3f3f4] text-[#1a1c1c] py-2.5 px-4 outline-none"
                >
                  <option>All Statuses</option>
                  <option>Upcoming</option>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#45464e]">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-main mb-20 px-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
                {event.eventImage ? (
                  <img src={event.eventImage} alt={event.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="bg-gray-100 h-48 w-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300">event</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-primary">{event.title}</h3>
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">calendar_today</span> {format(new Date(event.eventDate), "PPP")}</p>
                    <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">schedule</span> {format(new Date(event.eventDate), "p")}</p>
                    <p className="flex items-center gap-2"><span className="material-symbols-outlined text-base">location_on</span> {event.location}</p>
                  </div>
                  <p className="text-gray-700 mb-6 line-clamp-3 text-sm flex-grow">{event.description}</p>
                  <Link to="/contact" className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-[#d87c00] transition-colors text-center block mt-auto">
                    Register Interest
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-4">event_busy</span>
            <h3 className="text-xl font-bold text-gray-800">No programs or events found</h3>
            <p className="text-gray-500 mt-2">Check back later or try adjusting your search.</p>
          </div>
        )}
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

export default Events;
