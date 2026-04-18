use serde::{Deserialize, Serialize};
use std::process::Command;

/// Port state type matching frontend
#[allow(dead_code)]
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum PortState {
    #[serde(rename = "LISTENING")]
    Listening,
    #[serde(rename = "ESTABLISHED")]
    Established,
    #[serde(rename = "TIME_WAIT")]
    TimeWait,
    #[serde(rename = "CLOSE_WAIT")]
    CloseWait,
    #[serde(rename = "SYN_SENT")]
    SynSent,
    #[serde(rename = "SYN_RECV")]
    SynRecv,
    #[serde(rename = "FIN_WAIT1")]
    FinWait1,
    #[serde(rename = "FIN_WAIT2")]
    FinWait2,
    #[serde(rename = "CLOSING")]
    Closing,
    #[serde(rename = "LAST_ACK")]
    LastAck,
}

/// Port information matching frontend types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PortInfo {
    pub port: u16,
    pub protocol: String, // "TCP" or "UDP"
    #[serde(rename = "localAddress")]
    pub local_address: String,
    #[serde(rename = "remoteAddress")]
    pub remote_address: String,
    #[serde(rename = "processName")]
    pub process_name: String,
    pub pid: u32,
    pub state: String, // string format of PortState
}

/// Get all active network ports on Windows
/// Uses netstat command and parses output
#[tauri::command]
pub async fn get_active_ports() -> Result<Vec<PortInfo>, String> {
    get_ports_netstat()
}

/// Parse netstat output for active ports
fn get_ports_netstat() -> Result<Vec<PortInfo>, String> {
    #[cfg(target_os = "windows")]
    {
        let output = Command::new("netstat")
            .args(&["-ano"])
            .output()
            .map_err(|e| format!("Failed to run netstat: {}", e))?;

        if !output.status.success() {
            return Err("netstat command failed".to_string());
        }

        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut ports = Vec::new();

        // Skip header lines
        for line in stdout.lines().skip(4) {
            if let Ok(port_info) = parse_netstat_line(line) {
                ports.push(port_info);
            }
        }

        Ok(ports)
    }

    #[cfg(not(target_os = "windows"))]
    {
        // For non-Windows, return empty for now
        Ok(Vec::new())
    }
}

/// Parse a single netstat line
/// Format: PROTO  LOCAL_ADDRESS      REMOTE_ADDRESS     STATE           PID
fn parse_netstat_line(line: &str) -> Result<PortInfo, String> {
    let parts: Vec<&str> = line.split_whitespace().collect();

    if parts.len() < 5 {
        return Err("Invalid netstat line".to_string());
    }

    let protocol = parts[0]; // "TCP" or "UDP"
    let local_address = parts[1];
    let remote_address = parts[2];
    let state = parts[3];
    let pid_str = parts[4];

    // Parse local address to extract port
    let (local_ip, port) = parse_address(local_address)?;

    // Get process name from PID
    let pid: u32 = pid_str
        .parse()
        .map_err(|_| "Failed to parse PID".to_string())?;
    let process_name = get_process_name(pid).unwrap_or_else(|| format!("PID:{}", pid));

    Ok(PortInfo {
        port: port as u16,
        protocol: protocol.to_uppercase(),
        local_address: local_ip.to_string(),
        remote_address: remote_address.to_string(),
        process_name,
        pid,
        state: state.to_uppercase(),
    })
}

/// Extract IP and port from address string (e.g., "127.0.0.1:8080")
fn parse_address(addr: &str) -> Result<(&str, u16), String> {
    if let Some(colon_pos) = addr.rfind(':') {
        let ip = &addr[..colon_pos];
        let port_str = &addr[colon_pos + 1..];
        let port = port_str
            .parse::<u16>()
            .map_err(|_| "Failed to parse port".to_string())?;
        Ok((ip, port))
    } else {
        Err("Invalid address format".to_string())
    }
}

/// Get process name from PID using tasklist
#[cfg(target_os = "windows")]
fn get_process_name(pid: u32) -> Option<String> {
    let output = Command::new("tasklist")
        .args(&["/FI", &format!("PID eq {}", pid)])
        .output()
        .ok()?;

    let stdout = String::from_utf8_lossy(&output.stdout);

    // tasklist output format includes process name in the first column
    for line in stdout.lines().skip(3) {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if !parts.is_empty() {
            return Some(parts[0].to_string());
        }
    }

    None
}

#[cfg(not(target_os = "windows"))]
fn get_process_name(_pid: u32) -> Option<String> {
    None
}
