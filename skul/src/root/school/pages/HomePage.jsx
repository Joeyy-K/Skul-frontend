import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { SchoolContext } from "../context/schoolcontext";
import Cookies from "js-cookie";

function HomePage() {
    const { user } = useContext(UserContext);
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const { school } = useContext(SchoolContext)
    const [schoolData, setSchoolData] = useState(null);

    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(date);
      }

    let userToken = Cookies.get('userToken');
    console.log(user)
    console.log(school)
  
    const fetchSchoolData = async (schoolId) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/school/schools/${schoolId}/`, {
            headers: {
              'Authorization': `Token ${userToken}`,
            },
          });
          const data = await response.json();
          setSchoolData(data);
        } catch (error) {
          console.error('Error fetching school data:', error);
        }
    };

    useEffect(() => {
        if (user) {
          const schoolId = user.id;
          fetchSchoolData(schoolId);
        }
    }, [user]);
  
    useEffect(() => {
        fetch('http://127.0.0.1:8000/school/announcements/', {
        headers: {
            'Authorization': `Token ${userToken}`,
        
        },
        })
        .then(response => response.json())
        .then(data => {
        console.log('Announcements data:', data);  
        setAnnouncements(data);
        })
    }, [school])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/school/events/', {
        headers: {
            'Authorization': `Token ${userToken}`,
        
        },
        })
        .then(response => response.json())
        .then(data => {
        console.log('Events data:', data);  
        setEvents(data);
        })
    }, [school])
      

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">No user data</h2>
                    <p className="text-gray-500 bg-white rounded-md p-4">Unable to fetch user information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-20">                   
            <div className="ml-10 mb-8">
                <div className="bg-white dark:bg-gray-800 block rounded-xl border w-5/6 border-gray-800 p-4">
                    <h2 className="mt-1 mb-2 font-semibold text-base sm:text-lg text-black dark:text-white dark:bg-gray-700 rounded-xl p-1 px-3">
                    🗣🔊 Latest Announcements
                    </h2>
                    <hr className="my-3 dark:bg-white bg-black h-0.5"/>
                    {announcements.length === 0 ? (
                        <p className="ml-3 font-semibold text-base sm:text-lg text-black dark:text-white">No announcements yet.</p>
                    ) : (
                    announcements.map((announcement, index) => (
                    <div key={index}>
                        <h3 className="mt-2 ml-3 font-semibold text-base sm:text-lg text-black dark:text-white">📢 {announcement.title}</h3>
                        <p className="my-2 ml-3 block text-sm font-medium sm:text-base text-black dark:text-white">{announcement.content}</p>
                        <p className="my-2 ml-3 block text-sm font-medium sm:text-base text-black dark:text-white">{announcement.attachment}</p>
                        <p className="my-2 ml-3 block text-sm font-thin text-black dark:text-white">
                            {formatDate(announcement.publish_date)}
                        </p>
                    </div>
                        ))
                    )}
                </div>
            </div>
            <div className="ml-10 mb-8">
                <div className="bg-white dark:bg-gray-800 block rounded-xl border w-5/6 border-gray-800 p-4">
                    <h2 className="mt-1 mb-2 font-semibold text-base sm:text-lg text-black dark:text-white dark:bg-gray-700 rounded-xl p-1 px-3">
                    🗣🔊 Latest Events
                    </h2>
                    <hr className="my-3 dark:bg-white bg-black h-0.5"/>
                    {events.length === 0 ? (
                        <p className="ml-3 font-semibold text-base sm:text-lg text-black dark:text-white">No events yet.</p>
                    ) : (
                    events.map((events, index) => (
                    <div key={index}>
                        <h3 className="mt-2 ml-3 font-semibold text-base sm:text-lg text-black dark:text-white">📢 {events.title}</h3>
                        <p className="my-2 ml-3 block text-sm font-medium sm:text-base text-black dark:text-white">Starts: {events.start_date}</p>
                        <p className="my-2 ml-3 block text-sm font-medium sm:text-base text-black dark:text-white">Ends: {events.end_date}</p>
                        <p className="my-2 ml-3 block text-sm font-medium sm:text-base text-black dark:text-white">{events.event_type}</p>
                        <p className="my-2 ml-3 block text-sm font-medium sm:text-base text-black dark:text-white">Teachers: {events.related_teachers}</p>
                        <p className="my-2 ml-3 block text-sm font-medium sm:text-base text-black dark:text-white">Third_Parties: {events.related_entities}</p>
                    </div>
                        ))
                    )}
                </div>
            </div>
            <hr className="my-3 dark:bg-white bg-black h-0.1"/>
        </div>
    );
    }

    export default HomePage;
