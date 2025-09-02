import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { TimezoneDTO } from "../../Backend/Dto/AjustesDTO";

interface Settings {
    zona_horaria: string;
    idioma: string;
    cierre_dia_hora: number;
}

export const useSettings = () => {
    const { getToken } = useAuth();
    const [timezones, setTimezones] = useState<TimezoneDTO[]>([]);
    const [settings, setSettings] = useState<Settings>({
        zona_horaria: "America/Lima",
        idioma: "es",
        cierre_dia_hora: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchTimezones = async () => {
        try {
            const token = await getToken();
            if (!token) throw new Error('No hay token de autenticación');

            const response = await fetch(`${import.meta.env.VITE_API}/timezones`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener zonas horarias');
            }

            const data = await response.json();
            setTimezones(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    };

    const fetchUserSettings = async () => {
        try {
            const token = await getToken();
            if (!token) throw new Error('No hay token de autenticación');

            const response = await fetch(`${import.meta.env.VITE_API}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener configuración del usuario');
            }

            const data = await response.json();
            setSettings({
                zona_horaria: data.zona_horaria,
                idioma: data.idioma,
                cierre_dia_hora: data.cierre_dia_hora
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    };

    const updateSettings = async (newSettings: Partial<Settings>): Promise<boolean> => {
        setSaving(true);
        try {
            const token = await getToken();
            if (!token) throw new Error('No hay token de autenticación');

            const response = await fetch(`${import.meta.env.VITE_API}/me`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSettings)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la configuración');
            }

            setSettings(prevSettings => ({
                ...prevSettings,
                ...newSettings
            }));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            return false;
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            setError(null);
            try {
                await Promise.all([
                    fetchTimezones(),
                    fetchUserSettings()
                ]);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    return {
        timezones,
        settings,
        loading,
        saving,
        error,
        updateSettings
    };
};
