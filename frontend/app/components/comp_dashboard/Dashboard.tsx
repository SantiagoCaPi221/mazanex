import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Definición de la estructura de datos (Interface) para cumplir con TypeScript
interface Task {
    id: number;
    title: string;
    status: string;
}

const Dashboard = () => {
    // Especificamos que el estado será un arreglo de objetos tipo Task
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        // Llamada al API Gateway que redirige al ms-projects
        axios.get('http://localhost:8080/api/projects/1/tasks', {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
        })
        .then((response: { data: Task[] }) => {
            setTasks(response.data);
        })
        .catch((error: unknown) => {
            console.error("Error al cargar tareas:", error);
        });
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Panel de Gestión de Proyectos</h1>
            <table className="min-w-full bg-white shadow-md rounded">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Tarea</th>
                        <th className="py-2 px-4 border-b">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td className="py-2 px-4 border-b">{task.id}</td>
                            <td className="py-2 px-4 border-b">{task.title}</td>
                            <td className="py-2 px-4 border-b">{task.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;