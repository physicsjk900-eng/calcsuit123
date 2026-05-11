$baseDir = "d:\Calculators"
$files = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse

foreach ($file in $files) {
    # Calculate depth
    $relativePath = $file.FullName.Substring($baseDir.Length).TrimStart('\')
    $depth = ($relativePath -split '\\').Count - 1
    
    if ($depth -eq 0) {
        $faviconPath = "./images/favicon.png"
    } else {
        $prefix = "../" * $depth
        $faviconPath = "${prefix}images/favicon.png"
    }
    
    $faviconTag = "    <link rel=`"icon`" type=`"image/png`" href=`"$faviconPath`">`n"
    
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    if ($content -notmatch 'rel="icon"' -and $content -notmatch "favicon.png") {
        if ($content -match "</head>") {
            $content = $content -replace "</head>", "$faviconTag</head>"
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "Added to $($file.FullName)"
        }
    }
}
