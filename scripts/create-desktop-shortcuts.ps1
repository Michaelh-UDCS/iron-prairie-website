$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath('Desktop')
$ProjectDir = 'C:\Users\micha\Desktop\Iron-Prairie-Website'
$IconPath = Join-Path $ProjectDir 'public\app-icon.ico'

# 1. Iron Prairie Website Shortcut
$ShortcutWebsite = $WshShell.CreateShortcut((Join-Path $DesktopPath 'Iron Prairie Website.lnk'))
$ShortcutWebsite.TargetPath = Join-Path $ProjectDir 'Iron-Prairie-Website.bat'
$ShortcutWebsite.WorkingDirectory = $ProjectDir
$ShortcutWebsite.Description = 'Launch Iron Prairie Website & Dev Demo'
if (Test-Path $IconPath) {
    $ShortcutWebsite.IconLocation = "$IconPath,0"
}
$ShortcutWebsite.Save()

# 2. Iron Prairie Operations Shortcut
$ShortcutOps = $WshShell.CreateShortcut((Join-Path $DesktopPath 'Iron Prairie Operations.lnk'))
$ShortcutOps.TargetPath = Join-Path $ProjectDir 'Iron-Prairie-Desktop-Ops.bat'
$ShortcutOps.WorkingDirectory = $ProjectDir
$ShortcutOps.Description = 'Launch Iron Prairie Desktop Operations & ASME MTR Platform'
if (Test-Path $IconPath) {
    $ShortcutOps.IconLocation = "$IconPath,0"
}
$ShortcutOps.Save()

Write-Output "Successfully created Desktop shortcuts:"
Write-Output " - $DesktopPath\Iron Prairie Website.lnk"
Write-Output " - $DesktopPath\Iron Prairie Operations.lnk"
