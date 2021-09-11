interface IDevice {
    id: string;
    location: number;
    mac_address: string;
    connected: boolean;
    parent_location: number;
    updated_at: string;
    signal: number;
}

interface IUpdateDevice {
    location: number;
    mac_address: string;
    connected: boolean;
    parent_location: number;
    updated_at: string;
    signal: number;
}
