import { createContext, useState, useContext, useEffect } from 'react';

const EventContext = createContext();

const loadFromStorage = (key, fallback) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch { return fallback; }
};

export function EventProvider({ children }) {
    const [events, setEvents] = useState(() =>
        loadFromStorage('eventhub_events', [
            { name: 'Tech Summit 2026', date: '2026-04-15' },
            { name: 'AI Workshop', date: '2026-04-22' },
            { name: 'Hackathon Spring 2026', date: '2026-05-10' }
        ])
    );

    const [registrations, setRegistrations] = useState(() =>
        loadFromStorage('eventhub_registrations', [])
    );

    // Persist to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('eventhub_events', JSON.stringify(events));
    }, [events]);

    useEffect(() => {
        localStorage.setItem('eventhub_registrations', JSON.stringify(registrations));
    }, [registrations]);

    const addEvent = (eventName, eventDate) => {
        setEvents((prev) => [...prev, { name: eventName, date: eventDate }]);
    };

    const removeEvent = (eventName) => {
        setEvents((prev) => prev.filter((e) => e.name !== eventName));
    };

    const addRegistration = (registration) => {
        setRegistrations((prev) => [...prev, registration]);
    };

    const removeRegistration = (email, eventName) => {
        setRegistrations((prev) =>
            prev.filter((r) => !(r.email === email && r.eventName === eventName))
        );
    };

    return (
        <EventContext.Provider value={{ events, registrations, addEvent, removeEvent, addRegistration, removeRegistration }}>
            {children}
        </EventContext.Provider>
    );
}

export function useEvents() {
    return useContext(EventContext);
}

export default EventContext;
