'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, AlertCircle, Users, Check, Edit2, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Task {
    id: number;
    title: string;
    status: string;
    assignee?: string;
}

const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('ALL');
    const [currentUser, setCurrentUser] = useState<any>(null);

    // 🔥 CAMBIA ESTE CORREO POR EL QUE USES PARA TU CUENTA ADMIN EN LA DEMO 🔥
    const adminEmail = "bruno@mazanex.cl"; 

    useEffect(() => {
        // Obtenemos el usuario del localStorage de forma segura
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("user");
            if (userStr) setCurrentUser(JSON.parse(userStr));
        }

        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/projects/1/tasks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(response.data || []);
            } catch (err) {
                setError("Error de conexión con el módulo de Proyectos.");
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const isAdmin = currentUser?.email === adminEmail;

    // Acción para marcar tarea como completada (PUT)
    const handleCompleteTask = async (task: Task) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:8080/api/projects/1/tasks/${task.id}`, 
                { title: task.title, status: 'DONE' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setTasks(tasks.map(t => t.id === task.id ? response.data : t));
        } catch (err) {
            console.error("Error al actualizar la tarea:", err);
            alert("No se pudo completar la tarea. Revisa la consola.");
        }
    };

    // Placeholder para acciones de Admin (Para la presentación)
    const handleAdminAction = (action: string) => {
        alert(`Simulación de ${action}. En producción esto abre un modal.`);
    };

    // Cálculos para KPIs y Gráficos
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'DONE' || t.status === 'COMPLETADA').length;
    const pendingTasks = totalTasks - completedTasks;

    const chartData = [
        { name: 'Completadas', value: completedTasks, color: '#10b981' }, 
        { name: 'Pendientes', value: pendingTasks, color: '#f59e0b' }     
    ];

    const filteredTasks = tasks.filter(t => {
        if (filter === 'ALL') return true;
        if (filter === 'DONE') return t.status === 'DONE' || t.status === 'COMPLETADA';
        return t.status !== 'DONE' && t.status !== 'COMPLETADA';
    });

    if (loading) return <div className="p-10 text-center text-slate-400">Cargando métricas de Innovatech...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Monitoreo y Analítica</h1>
                <p className="text-slate-500 mt-2">Visibilidad en tiempo real del progreso de proyectos.</p>
                {/* Etiqueta visual para saber con qué rol entraste */}
                <div className="mt-2 inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">
                    Rol activo: {isAdmin ? 'ADMINISTRADOR' : 'USUARIO'}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full"><Clock size={24} /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase">Total Tareas</p>
                            <p className="text-3xl font-black text-slate-800">{totalTasks}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full"><CheckCircle size={24} /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase">Completadas</p>
                            <p className="text-3xl font-black text-slate-800">{completedTasks}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center h-48">
                    <h3 className="text-sm font-bold text-slate-500 uppercase text-center mb-2">Avance Global</h3>
                    {totalTasks > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-slate-400 italic text-sm">Sin datos para graficar</p>
                    )}
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="text-indigo-500" size={20}/> Asignación de Recursos
                    </h2>
                    <div className="flex gap-4 items-center">
                        {isAdmin && (
                            <button 
                                onClick={() => handleAdminAction('Crear Nueva Tarea')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md"
                            >
                                + Nueva Tarea
                            </button>
                        )}
                        <select 
                            className="bg-white border border-slate-200 text-slate-700 rounded-lg px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="ALL">Todas las tareas</option>
                            <option value="PENDING">Pendientes</option>
                            <option value="DONE">Completadas</option>
                        </select>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Tarea</th>
                            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
                            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                            <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => {
                                const isDone = task.status === 'DONE' || task.status === 'COMPLETADA';
                                // Verifica si la tarea le pertenece al usuario logueado
                                const isMyTask = currentUser?.name === task.assignee;

                                return (
                                    <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-4 px-6 text-slate-400 font-mono text-sm">#{task.id}</td>
                                        <td className={`py-4 px-6 font-medium ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                            {task.title}
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 text-sm font-medium">
                                            {task.assignee ? task.assignee : <span className="italic text-slate-300">Sin asignar</span>}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                                                isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {isDone ? 'Completada' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {/* LÓGICA DE ROLES EN LA TABLA */}
                                            {isAdmin ? (
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleAdminAction('Editar')} className="text-blue-500 hover:text-blue-700 p-1 bg-blue-50 rounded" title="Editar">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleAdminAction('Borrar')} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded" title="Borrar">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                !isDone && isMyTask && (
                                                    <button 
                                                        onClick={() => handleCompleteTask(task)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Check size={14} /> Completar
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-500 italic">
                                    <div className="flex flex-col items-center justify-center">
                                        <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                                        No hay tareas que coincidan con el filtro.
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;