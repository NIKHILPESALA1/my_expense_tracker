# Expense Tracker CLI for PowerShell

$baseUrl = "http://localhost:8085/expenses"

function ShowMenu {
    Write-Host "Expense Tracker CLI"
    Write-Host "1. List all expenses"
    Write-Host "2. Get an expense by ID"
    Write-Host "3. Create a new expense"
    Write-Host "4. Update an expense"
    Write-Host "5. Delete an expense"
    Write-Host "6. Health check"
    Write-Host "0. Exit"
}

do {
    ShowMenu
    $choice = Read-Host "Enter your choice"

    switch ($choice) {
        "1" {
            Write-Host "`nFetching all expenses..."
            Invoke-RestMethod -Method GET -Uri $baseUrl | Format-Table
        }
        "2" {
            $id = Read-Host "Enter expense ID"
            Invoke-RestMethod -Method GET -Uri "$baseUrl/$id" | Format-List
        }
        "3" {
            $desc = Read-Host "Enter description"
            $amt = Read-Host "Enter amount"
            $body = @{
                description = $desc
                amount = [int]$amt
            } | ConvertTo-Json
            Invoke-RestMethod -Method POST -Uri $baseUrl -ContentType "application/json" -Body $body
            Write-Host "Expense created!"
        }
        "4" {
            $id = Read-Host "Enter expense ID to update"
            $desc = Read-Host "Enter new description"
            $amt = Read-Host "Enter new amount"
            $body = @{
                description = $desc
                amount = [int]$amt
            } | ConvertTo-Json
            Invoke-RestMethod -Method PUT -Uri "$baseUrl/$id" -ContentType "application/json" -Body $body
            Write-Host "Expense updated!"
        }
        "5" {
            $id = Read-Host "Enter expense ID to delete"
            Invoke-RestMethod -Method DELETE -Uri "$baseUrl/$id"
            Write-Host "Expense deleted!"
        }
        "6" {
            Invoke-RestMethod -Method GET -Uri "http://localhost:8085/health"
        }
        "0" { Write-Host "Exiting..." }
        default { Write-Host "Invalid choice. Try again." }
    }

    Write-Host "`n"
} while ($choice -ne "0")
