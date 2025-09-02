import { TimezoneDTO } from "../Dto/AjustesDTO";

export class TimezoneModel {
    private static readonly TIMEZONES: TimezoneDTO[] = [
        {
            value: "UTC",
            label: "UTC (Tiempo Universal Coordinado)",
            offset: "+00:00"
        },
        {
            value: "America/Lima",
            label: "Lima, Perú (PET)",
            offset: "-05:00"
        },
        {
            value: "America/Bogota",
            label: "Bogotá, Colombia (COT)",
            offset: "-05:00"
        },
        {
            value: "America/Buenos_Aires",
            label: "Buenos Aires, Argentina (ART)",
            offset: "-03:00"
        },
        {
            value: "America/Santiago",
            label: "Santiago, Chile (CLT)",
            offset: "-04:00"
        },
        {
            value: "America/Caracas",
            label: "Caracas, Venezuela (VET)",
            offset: "-04:00"
        }
    ];

    static getAllTimezones(): TimezoneDTO[] {
        return this.TIMEZONES;
    }

    static isValidTimezone(timezone: string): boolean {
        return this.TIMEZONES.some(tz => tz.value === timezone);
    }

    static detectTimezone(offsetMinutes: number): string {
        // Encuentra la primera zona horaria que coincida con el offset en minutos
        const matchingTimezone = this.TIMEZONES.find(tz => {
            const tzOffset = this.parseOffset(tz.offset);
            return tzOffset === offsetMinutes;
        });

        return matchingTimezone?.value || "UTC";
    }

    private static parseOffset(offset: string): number {
        const [hours, minutes] = offset.substring(1).split(':').map(Number);
        const multiplier = offset.startsWith('+') ? 1 : -1;
        return multiplier * (hours * 60 + minutes);
    }
}
