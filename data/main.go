package main

import (
	"encoding/csv"
	"fmt"
	"math/rand"
	"os"
	"time"
)

const (
	numEntries   = 100000000
	cityID       = "713b7600-4c05-48fc-86d1-31974c747ce3"
	emailDomain  = "@maalik.dev"
	defaultEmail = "user%d@maalik.dev"
)

func main() {
	// Create the CSV file
	file, err := os.Create("users.csv")
	if err != nil {
		fmt.Println("Error creating CSV file:", err)
		return
	}
	defer file.Close()

	// Create a CSV writer
	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write the header
	header := []string{"password", "last_login", "is_superuser", "username", "is_staff", "is_active", "date_joined",
		"created_at", "updated_at", "id", "avatar", "google_id", "apple_id", "first_name", "last_name",
		"email", "email_verified", "has_contributed", "city_id"}
	if err := writer.Write(header); err != nil {
		fmt.Println("Error writing header to CSV:", err)
		return
	}

	// Generate and write random data for each entry
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < numEntries; i++ {
		email := fmt.Sprintf(defaultEmail, i)
		record := []string{"password123", "", "false", fmt.Sprintf("user%d", i), "false", "true", time.Now().Format(time.RFC3339),
			time.Now().Format(time.RFC3339), time.Now().Format(time.RFC3339), genUUID(), "", "", "", "", "", email, "true", "false", cityID}
		if err := writer.Write(record); err != nil {
			fmt.Println("Error writing record to CSV:", err)
			return
		}
	}

	fmt.Println("CSV file created successfully.")
}

func genUUID() string {
	// Generate a random UUID
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}
