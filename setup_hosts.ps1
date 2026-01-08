# PowerShell script to update hosts file for local subdomain testing
# Run this script as Administrator

$hostsFile = "$env:SystemRoot\System32\drivers\etc\hosts"
$ip = "127.0.0.1"
$domains = @(
    "monkey-tech-solutions.localhost",
    "company-4.localhost",
    "company-9.localhost",
    "company-10.localhost",
    "test-company.localhost"
)

# Check for Administrator privileges
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Please run this script as Administrator!" -ForegroundColor Red
    Write-Host "Right-click on the script or PowerShell and select 'Run as administrator'"
    exit
}

Write-Host "Updating hosts file at $hostsFile..." -ForegroundColor Cyan

try {
    $content = Get-Content $hostsFile -Raw
    $newEntries = $false

    foreach ($domain in $domains) {
        if ($content -notmatch "$ip\s+$domain") {
            Add-Content -Path $hostsFile -Value "$ip $domain"
            Write-Host "Added: $domain" -ForegroundColor Green
            $newEntries = $true
        } else {
            Write-Host "Skipping: $domain (already exists)" -ForegroundColor Gray
        }
    }

    if ($newEntries) {
        Write-Host "Flushing DNS cache..."
        ipconfig /flushdns
        Write-Host "Hosts file updated successfully!" -ForegroundColor Green
    } else {
        Write-Host "No changes needed." -ForegroundColor Green
    }

} catch {
    Write-Host "Error updating hosts file: $_" -ForegroundColor Red
}

Write-Host "`nYou can now access:"
foreach ($domain in $domains) {
    Write-Host "  http://$($domain):5173" -ForegroundColor Cyan
}
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
