@echo off

:nc

if exist "./%~2/" (
    echo File '%~2' already exists...
    EXIT /B 1
) else (
    mkdir "./%~2/"

    >"./%~2/%~2.jsx" (
    for %%I in (
        "import React from "react";"
        "import "./style.scss";"
        echo.
        "function %~2() {"
        echo.
        "   return ("
        "       <div id="%~2" className="page"></div>"
        "   );"
        "}"
        echo.
        "export default %~2;"
    ) do if "%%~I" == "echo." ( echo. ) else ( echo %%~I )
    )
    echo File '%~2.jsx' created at "./%~2/%~2.jsx"

    >"./%~2/style.scss" (
    for %%I in (
        "#%~2 {}"
    ) do if "%%~I" == "echo." ( echo. ) else ( echo %%~I )
    )
    echo File 'style.scss' created at "./%~2/style.scss"
)

EXIT /B 0
