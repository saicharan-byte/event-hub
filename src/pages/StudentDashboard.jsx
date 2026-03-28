import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEvents } from '../context/EventContext.jsx';
import RegistrationModal from '../components/RegistrationModal.jsx';

function StudentDashboard() {
    const [activePage, setActivePage] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [confirmCancel, setConfirmCancel] = useState(null);
    const { user, logout } = useAuth();
    const { events, registrations, removeRegistration } = useEvents();
    const navigate = useNavigate();

    const myRegs = registrations.filter(r => r.email === user?.email);
    const regNames = myRegs.map(r => r.eventName);
    const today = new Date(); today.setHours(0,0,0,0);
    const isExpired = (dateStr) => { if (!dateStr) return false; return new Date(dateStr+'T00:00:00') < today; };
    const available = events.filter(e => !regNames.includes(e.name) && !isExpired(e.date));
    const expired = events.filter(e => isExpired(e.date));
    const fmt = (d) => d ? new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '';
    const getEventDate = (name) => { const ev = events.find(e => e.name === name); return ev ? ev.date : ''; };

    const handleLogout = () => { logout(); navigate('/'); };
    const handleCancelReg = (reg) => { removeRegistration(reg.email, reg.eventName); setConfirmCancel(null); };

    const sideItems = [
        {id:'overview',label:'Dashboard',icon:'📊'},{id:'register',label:'Register for Events',icon:'🎯'},
        {id:'my-events',label:'My Registrations',icon:'📋'},{id:'edit-reg',label:'Edit Registration',icon:'✏️'},
        {id:'profile',label:'My Profile',icon:'👤'}
    ];
    const stats = [
        {icon:'🎉',value:events.length,label:'Available Events',g:'linear-gradient(135deg,#a855f7,#ec4899)'},
        {icon:'✅',value:myRegs.length,label:'My Registrations',g:'linear-gradient(135deg,#6366f1,#a855f7)'},
        {icon:'🎯',value:available.length,label:'Open to Register',g:'linear-gradient(135deg,#10b981,#14b8a6)'}
    ];

    const Sidebar = () => (
        <aside className="glass-strong" style={{width:sidebarOpen?'260px':'0',overflow:sidebarOpen?'visible':'hidden',opacity:sidebarOpen?1:0,display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh',flexShrink:0,transition:'all 0.3s',borderRight:sidebarOpen?'1px solid rgba(255,255,255,0.1)':'none'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 16px',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <span style={{fontSize:'1.8rem'}}>🎒</span>
                    <div><div style={{fontSize:'1.05rem',fontWeight:800,color:'#fff'}}>EventHub</div><div style={{fontSize:'0.65rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'1.5px',color:'#c084fc'}}>Student Portal</div></div>
                </div>
                <button onClick={()=>setSidebarOpen(false)} style={{width:'32px',height:'32px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#9ca3af',fontSize:'0.9rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
            </div>
            <nav style={{flex:1,padding:'12px',display:'flex',flexDirection:'column',gap:'4px'}}>
                {sideItems.map(i=>(
                    <button key={i.id} onClick={()=>setActivePage(i.id)} style={{width:'100%',display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',borderRadius:'12px',border:'none',fontSize:'0.88rem',fontWeight:activePage===i.id?600:500,fontFamily:'inherit',cursor:'pointer',textAlign:'left',background:activePage===i.id?'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(168,85,247,0.08))':'transparent',color:activePage===i.id?'#c084fc':'#9ca3af'}}>
                        <span style={{fontSize:'1.1rem',width:'24px',textAlign:'center'}}>{i.icon}</span><span>{i.label}</span>
                    </button>
                ))}
            </nav>
            <div style={{padding:'16px',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                    <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#a855f7,#ec4899)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.85rem',flexShrink:0}}>{user?.name?.charAt(0)?.toUpperCase()||'S'}</div>
                    <div style={{overflow:'hidden'}}><div style={{fontSize:'0.88rem',fontWeight:600,color:'#fff'}}>{user?.name||'Student'}</div><div style={{fontSize:'0.72rem',color:'#6b7280'}}>{user?.email||''}</div></div>
                </div>
                <button onClick={handleLogout} style={{width:'100%',padding:'10px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#9ca3af',fontSize:'0.85rem',fontWeight:600,fontFamily:'inherit',cursor:'pointer'}}>Logout</button>
            </div>
        </aside>
    );

    return (
        <div style={{display:'flex',minHeight:'100vh',background:'linear-gradient(135deg,#0f0c29 0%,#1a1145 30%,#302b63 60%,#24243e 100%)'}}>
            <Sidebar/>
            {!sidebarOpen&&<button onClick={()=>setSidebarOpen(true)} className="glass-strong" style={{position:'fixed',top:'16px',left:'16px',zIndex:200,width:'40px',height:'40px',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.1)',color:'#9ca3af',fontSize:'1.1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>☰</button>}

            <main style={{flex:1,overflowY:'auto',height:'100vh'}}>
                <div style={{padding:'36px 40px',paddingLeft:sidebarOpen?'40px':'72px',maxWidth:'1100px'}}>

                    {activePage==='overview'&&<div>
                        <div style={{marginBottom:'32px'}}><h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:'6px'}}>Welcome, {user?.name||'Student'}! 👋</h1><p style={{fontSize:'0.95rem',color:'#9ca3af'}}>Here's a quick overview of your event activity.</p></div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',marginBottom:'36px'}}>
                            {stats.map((s,i)=>(<div key={i} className="glass" style={{borderRadius:'16px',padding:'24px',display:'flex',alignItems:'center',gap:'16px'}}><div style={{width:'52px',height:'52px',borderRadius:'14px',background:s.g,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0}}>{s.icon}</div><div><div style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',lineHeight:1}}>{s.value}</div><div style={{fontSize:'0.78rem',color:'#9ca3af',marginTop:'4px'}}>{s.label}</div></div></div>))}
                        </div>
                        {myRegs.length>0&&<div style={{marginBottom:'36px'}}><h2 style={{fontSize:'1.2rem',fontWeight:700,color:'#fff',marginBottom:'20px'}}>📋 My Registered Events</h2><div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>{myRegs.map((r,i)=><div key={i} className="glass" style={{padding:'10px 20px',borderRadius:'50px',display:'flex',alignItems:'center',gap:'8px',fontSize:'0.88rem'}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#c084fc'}}/><span style={{color:'#fff'}}>{r.eventName}</span><span style={{fontSize:'0.72rem',color:'#c084fc',fontWeight:600}}>📆 {fmt(getEventDate(r.eventName))}</span></div>)}</div></div>}
                        {available.length>0&&<div><h2 style={{fontSize:'1.2rem',fontWeight:700,color:'#fff',marginBottom:'20px'}}>🎯 Events You Can Join</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'20px'}}>{available.slice(0,3).map((ev,i)=><div key={i} className="glass" style={{borderRadius:'16px',overflow:'hidden'}}>
                            <div style={{height:'4px',background:'linear-gradient(to right,#a855f7,#ec4899)'}}/>
                            <div style={{padding:'24px',textAlign:'center'}}><div style={{fontSize:'2rem',marginBottom:'10px'}}>🎯</div><h3 style={{fontSize:'1rem',fontWeight:700,color:'#fff',marginBottom:'4px'}}>{ev.name}</h3><p style={{fontSize:'0.82rem',color:'#c084fc',fontWeight:600,marginBottom:'14px'}}>📆 {fmt(ev.date)}</p><button onClick={()=>setActivePage('register')} style={{width:'100%',padding:'10px',borderRadius:'12px',background:'linear-gradient(to right,#a855f7,#ec4899)',color:'#fff',fontSize:'0.85rem',fontWeight:600,border:'none',cursor:'pointer',fontFamily:'inherit'}}>View All Events →</button></div>
                        </div>)}</div></div>}
                    </div>}

                    {activePage==='register'&&<div>
                        <div style={{marginBottom:'32px'}}><h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:'6px'}}>Register for Events</h1><p style={{fontSize:'0.95rem',color:'#9ca3af'}}>Browse available events and register.</p></div>
                        {available.length===0?<div className="glass" style={{borderRadius:'16px',padding:'40px',textAlign:'center',color:'#6b7280'}}>{events.length===0?'No events available.':'🎉 You\'ve registered for all events!'}</div>:
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'20px',marginBottom:'36px'}}>{available.map((ev,i)=><div key={i} className="glass" style={{borderRadius:'16px',overflow:'hidden'}}>
                            <div style={{height:'4px',background:'linear-gradient(to right,#a855f7,#ec4899)'}}/>
                            <div style={{padding:'24px',textAlign:'center'}}><div style={{fontSize:'2rem',marginBottom:'10px'}}>🎯</div><h3 style={{fontSize:'1rem',fontWeight:700,color:'#fff',marginBottom:'4px'}}>{ev.name}</h3><p style={{fontSize:'0.82rem',color:'#c084fc',fontWeight:600,marginBottom:'14px'}}>📆 {fmt(ev.date)}</p><button onClick={()=>setSelectedEvent(ev.name)} style={{width:'100%',padding:'10px',borderRadius:'12px',background:'linear-gradient(to right,#a855f7,#ec4899)',color:'#fff',fontSize:'0.85rem',fontWeight:600,border:'none',cursor:'pointer',fontFamily:'inherit'}}>Register Now</button></div>
                        </div>)}</div>}
                        {regNames.length>0&&<div style={{marginTop:'12px'}}><h2 style={{fontSize:'1.2rem',fontWeight:700,color:'#fff',marginBottom:'20px'}}>✅ Already Registered</h2><div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>{regNames.map((n,i)=><div key={i} className="glass" style={{padding:'10px 20px',borderRadius:'50px',display:'flex',alignItems:'center',gap:'8px',fontSize:'0.88rem'}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#c084fc'}}/><span style={{color:'#fff'}}>{n}</span><span style={{fontSize:'0.72rem',color:'#c084fc',fontWeight:600}}>📆 {fmt(getEventDate(n))}</span><span style={{fontSize:'0.65rem',color:'#34d399',fontWeight:700,marginLeft:'4px'}}>✓</span></div>)}</div></div>}
                        {expired.length>0&&<div style={{marginTop:'24px'}}><h2 style={{fontSize:'1.2rem',fontWeight:700,color:'#6b7280',marginBottom:'20px'}}>⏰ Past Events</h2><div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>{expired.map((ev,i)=><div key={i} className="glass" style={{padding:'10px 20px',borderRadius:'50px',display:'flex',alignItems:'center',gap:'8px',fontSize:'0.88rem',opacity:0.5}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#6b7280'}}/><span style={{color:'#9ca3af'}}>{ev.name}</span><span style={{fontSize:'0.72rem',color:'#6b7280',fontWeight:600}}>📆 {fmt(ev.date)}</span><span style={{fontSize:'0.65rem',color:'#f87171',fontWeight:700,marginLeft:'4px'}}>Completed</span></div>)}</div></div>}
                    </div>}

                    {activePage==='my-events'&&<div>
                        <div style={{marginBottom:'32px'}}><h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:'6px'}}>My Registrations</h1><p style={{fontSize:'0.95rem',color:'#9ca3af'}}>All events you've registered for.</p></div>
                        {myRegs.length===0?<div className="glass" style={{borderRadius:'16px',padding:'40px',textAlign:'center',color:'#6b7280'}}>You haven't registered yet. <button onClick={()=>setActivePage('register')} style={{color:'#c084fc',fontWeight:600,background:'none',border:'none',cursor:'pointer',textDecoration:'underline',fontFamily:'inherit',fontSize:'inherit'}}>Browse events →</button></div>:
                        <><div className="glass" style={{borderRadius:'16px',overflow:'hidden',marginBottom:'28px'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.9rem'}}><thead><tr style={{background:'rgba(255,255,255,0.05)'}}>
                            {['#','Event','Date','Name','Email','Phone','Status'].map(h=><th key={h} style={{padding:'14px 20px',textAlign:'left',fontWeight:600,color:'#9ca3af',fontSize:'0.8rem',textTransform:'uppercase'}}>{h}</th>)}
                        </tr></thead><tbody>{myRegs.map((r,i)=><tr key={i} style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                            <td style={{padding:'14px 20px',color:'#6b7280',fontWeight:600}}>{i+1}</td>
                            <td style={{padding:'14px 20px'}}><span style={{padding:'3px 12px',borderRadius:'50px',fontSize:'0.8rem',fontWeight:600,background:'rgba(168,85,247,0.15)',color:'#c084fc'}}>{r.eventName}</span></td>
                            <td style={{padding:'14px 20px',color:'#c084fc',fontSize:'0.85rem',fontWeight:600}}>{fmt(getEventDate(r.eventName))}</td>
                            <td style={{padding:'14px 20px',color:'#fff',fontWeight:600}}>{r.studentName}</td>
                            <td style={{padding:'14px 20px',color:'#d1d5db'}}>{r.email}</td>
                            <td style={{padding:'14px 20px',color:'#d1d5db'}}>{r.phone}</td>
                            <td style={{padding:'14px 20px'}}><span style={{padding:'3px 12px',borderRadius:'50px',fontSize:'0.8rem',fontWeight:700,background:'rgba(16,185,129,0.12)',color:'#34d399'}}>Active</span></td>
                        </tr>)}</tbody></table></div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px'}}>{myRegs.map((r,i)=><div key={i} className="glass" style={{borderRadius:'16px',overflow:'hidden'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'18px 20px',borderBottom:'1px solid rgba(255,255,255,0.1)'}}><span style={{fontSize:'1.2rem'}}>🎯</span><h3 style={{fontWeight:700,color:'#fff',fontSize:'0.92rem'}}>{r.eventName}</h3></div>
                            <div style={{padding:'16px 20px'}}>{[['Name',r.studentName],['Email',r.email],['Phone',r.phone],['Event Date',fmt(getEventDate(r.eventName))]].map(([l,v],j)=><div key={j} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderTop:j>0?'1px solid rgba(255,255,255,0.03)':'none'}}><span style={{fontSize:'0.82rem',color:'#6b7280'}}>{l}</span><span style={{fontSize:'0.82rem',color:'#fff',fontWeight:600}}>{v}</span></div>)}</div>
                        </div>)}</div></>}
                    </div>}

                    {activePage==='edit-reg'&&<div>
                        <div style={{marginBottom:'32px'}}><h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:'6px'}}>Edit Registration</h1><p style={{fontSize:'0.95rem',color:'#9ca3af'}}>Cancel registrations you no longer want.</p></div>
                        {myRegs.length===0?<div className="glass" style={{borderRadius:'16px',padding:'40px',textAlign:'center',color:'#6b7280'}}>No registrations to edit.</div>:
                        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{myRegs.map((r,i)=><div key={i} className="glass" style={{borderRadius:'16px',padding:'18px 22px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'14px'}}><span style={{fontSize:'1.4rem'}}>🎯</span><div><div style={{fontWeight:600,color:'#fff',fontSize:'0.95rem'}}>{r.eventName}</div><div style={{fontSize:'0.78rem',color:'#6b7280',marginTop:'2px'}}>📆 {fmt(getEventDate(r.eventName))} · {r.studentName} · {r.email}</div></div></div>
                            {confirmCancel===`${r.email}-${r.eventName}`?<div style={{display:'flex',alignItems:'center',gap:'8px'}}><span style={{fontSize:'0.82rem',color:'#f87171',fontWeight:600}}>Cancel?</span><button onClick={()=>handleCancelReg(r)} style={{padding:'6px 16px',background:'#ef4444',color:'#fff',border:'none',borderRadius:'8px',fontSize:'0.8rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Yes</button><button onClick={()=>setConfirmCancel(null)} style={{padding:'6px 16px',background:'transparent',color:'#9ca3af',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',fontSize:'0.8rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>No</button></div>
                            :<button onClick={()=>setConfirmCancel(`${r.email}-${r.eventName}`)} style={{padding:'8px 18px',background:'transparent',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'12px',color:'#f87171',fontSize:'0.82rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>🗑️ Cancel</button>}
                        </div>)}</div>}
                    </div>}

                    {activePage==='profile'&&<div>
                        <div style={{marginBottom:'32px'}}><h1 style={{fontSize:'1.8rem',fontWeight:800,color:'#fff',marginBottom:'6px'}}>My Profile</h1><p style={{fontSize:'0.95rem',color:'#9ca3af'}}>Your account information.</p></div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'20px'}}>
                            {[{t:'👤 Personal Info',r:[['Name',user?.name||'N/A'],['Email',user?.email||'N/A'],['Role',user?.role||'Student']]},{t:'📈 Activity Summary',r:[['Events Registered',myRegs.length],['Available Events',available.length],['Total Events',events.length]]}].map((c,i)=>(
                                <div key={i} className="glass" style={{borderRadius:'16px',padding:'28px'}}><h3 style={{fontSize:'1.05rem',fontWeight:700,color:'#fff',marginBottom:'20px',paddingBottom:'12px',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>{c.t}</h3>{c.r.map(([l,v],j)=><div key={j} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderTop:j>0?'1px solid rgba(255,255,255,0.03)':'none'}}><span style={{fontSize:'0.88rem',color:'#9ca3af'}}>{l}</span><span style={{fontSize:'0.88rem',color:'#fff',fontWeight:600}}>{v}</span></div>)}</div>
                            ))}
                        </div>
                    </div>}
                </div>
            </main>

            {selectedEvent&&<RegistrationModal eventName={selectedEvent} studentName={user?.name||''} studentEmail={user?.email||''} onClose={()=>setSelectedEvent(null)}/>}
        </div>
    );
}
export default StudentDashboard;
