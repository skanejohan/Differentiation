$client = New-Object System.Net.WebClient
$client.Credentials = New-Object System.Net.NetworkCredential($Env:FtpUsername, $Env:FtpPassword)

function uploadToFTPServer($fileName) {
    $src = "./Out/${fileName}";
    $dst = "ftp://skanejohan@ftpcluster.loopia.se/apps.johanahlgren.se/public_html/math/${fileName}";

    if (Test-Path -Path $src) {
        Write-Host "Uploading $fileName to FTP server"
        $client.UploadFile($dst, $src)
    } else {
        Write-Host "File $fileName does not exist"
    }
}

uploadToFTPServer("index.css")
uploadToFTPServer("index.html")
uploadToFTPServer("index.js")
uploadToFTPServer("math.constants.js")
uploadToFTPServer("math.differentiation.js")
uploadToFTPServer("math.expressions.js")
uploadToFTPServer("math.expressions.matching.js")
uploadToFTPServer("math.expressions.simplification.js")
uploadToFTPServer("math.parser.js")
uploadToFTPServer("math.scanner.js")
uploadToFTPServer("math.tokens.js")
uploadToFTPServer("render.js")
