import pandas as pd
import tkinter as tk
from tkinter import filedialog, messagebox
import random

def select_file():
    """Open a file explorer dialog to select a CSV file."""
    root = tk.Tk()
    root.withdraw()  # Hide the main Tkinter window
    file_path = filedialog.askopenfilename(
        title="Select a CSV file",
        filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
    )
    return file_path

def read_csv_until_missing(file_path):
    """Read a CSV file into a DataFrame until encountering a row with missing fields."""
    try:
        # Read the CSV file into a pandas DataFrame
        data = pd.read_csv(file_path)

        # Ensure the first row serves as column headers
        headers = data.columns.tolist()

        # Check each row for missing fields
        valid_rows = []
        for index, row in data.iterrows():
            if row.isnull().any():
                print(f"Stopping at row {index} due to missing fields.")
                break
            valid_rows.append(row)

        # Create a new DataFrame with only valid rows
        valid_data = pd.DataFrame(valid_rows, columns=headers)
        return valid_data

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def start_game(data):
    """Start the game using the processed DataFrame."""
    guessed_names = set()  # Track guessed names

    def check_guess(user_input=None):
        if user_input is None:
            user_input = entry.get()

        if user_input == "":
            messagebox.showinfo("Input Error", "Please enter a value.")
            return

        if user_input in guessed_names:
            messagebox.showinfo("Invalid Guess", f"'{user_input}' has already been guessed.")
            return

        # Find the user-input row
        guessed_row = data[data.iloc[:, 0] == user_input]

        if guessed_row.empty:
            messagebox.showinfo("Result", "No match found.")
        else:
            guessed_names.add(user_input)  # Mark the name as guessed
            guessed_row_index = guessed_row.index[0]
            is_correct = guessed_row_index == random_row_index
            if is_correct:
                messagebox.showinfo("Victory!", "Congratulations, you guessed the correct row!")
                add_guess_visual(user_input, data.iloc[guessed_row_index, 1:], [True] * (len(data.columns) - 1))
                return
            else:
                shared_columns = data.iloc[random_row_index, 1:].eq(data.iloc[guessed_row_index, 1:]).tolist()
                add_guess_visual(user_input, data.iloc[guessed_row_index, 1:], shared_columns)

        entry.delete(0, tk.END)
        listbox.delete(0, 'end')  # Clear the listbox after guess

    def add_guess_visual(user_input, guessed_row_values, shared_columns):
        row_frame = tk.Frame(guesses_canvas_frame, bg="white")
        row_frame.pack(fill=tk.X, pady=2)

        # Add guessed value from the first column
        tk.Label(row_frame, text=user_input, width=20, anchor="w", bg="white").pack(side=tk.LEFT, padx=5)

        if shared_columns is not None and guessed_row_values is not None:
            for i, (value, match) in enumerate(zip(guessed_row_values, shared_columns)):
                color = "green" if match else "red"
                displayed_value = str(value)
                text = displayed_value[:10] + ("..." if len(displayed_value) > 10 else "")
                box = tk.Canvas(row_frame, width=100, height=30, bg=color)
                box.pack(side=tk.LEFT, padx=2)
                box.create_text(50, 15, text=text, fill="white")

            # Add the up/down arrow or checkmark inside the box for the second column (first column checked)
            true_value = data.iloc[random_row_index, 1]  # The true value from the second column
            guess_value = guessed_row_values.iloc[0]  # The guessed value from the second column (1st column of guessed row)
            
            if guess_value < true_value:
                arrow = "↑"  # Up arrow if guess is lower than the true value
                arrow_color = "green"
            elif guess_value > true_value:
                arrow = "↓"  # Down arrow if guess is higher than the true value
                arrow_color = "red"
            else:
                arrow = "✔"  # A checkmark if the guess is correct
                arrow_color = "green"

            # Modify the box for the second column to include the arrow
            second_column_box = row_frame.winfo_children()[1]  # Get the second canvas in the row frame
            second_column_box.create_text(50, 15, text="\t" + arrow, fill="white")  # Add arrow next to the value
            
        else:
            tk.Label(row_frame, text="No Match", bg="white").pack(side=tk.LEFT, padx=5)

        guesses_canvas.update_idletasks()
        guesses_canvas.configure(scrollregion=guesses_canvas.bbox("all"))

    def reset_game():
        nonlocal random_row_index
        random_row_index = random.randint(0, len(data) - 1)
        guessed_names.clear()  # Clear guessed names for a new round
        entry.delete(0, tk.END)
        listbox.delete(0, 'end')  # Clear the listbox
        for widget in guesses_canvas_frame.winfo_children():
            widget.destroy()

    def update_suggestions(event):
        user_input = entry.get()

        # Ensure the Listbox is updated based on user input
        listbox.delete(0, 'end')

        matching_rows = data[~data.iloc[:, 0].isin(guessed_names)]  # Exclude guessed names
        if user_input:  # Check if the user has typed something
            matching_rows = matching_rows[matching_rows.iloc[:, 0].str.startswith(user_input, na=False)]

        for value in matching_rows.iloc[:, 0].head(5):
            listbox.insert('end', value)

    def on_select(event):
        try:
            selection = listbox.get(listbox.curselection())
            entry.delete(0, tk.END)
            entry.insert(0, selection)
            check_guess(selection)
        except tk.TclError:
            pass  # Handle case where no selection is made

    def quit_game():
        game_window.destroy()
        exit()
        

    random_row_index = random.randint(0, len(data) - 1)

    game_window = tk.Tk()
    game_window.title("CSV Wordle Game")
    game_window.attributes('-fullscreen', True)  # Make the game fullscreen

    input_frame = tk.Frame(game_window)
    input_frame.pack(fill=tk.X, pady=5)

    tk.Label(input_frame, text="Enter your guess based on the first column:").pack(side=tk.LEFT, padx=5)
    entry = tk.Entry(input_frame, width=50)
    entry.pack(side=tk.LEFT, padx=5)
    tk.Button(input_frame, text="Submit", command=lambda: check_guess()).pack(side=tk.LEFT, padx=5)
    tk.Button(input_frame, text="Reset", command=reset_game).pack(side=tk.LEFT, padx=5)
    tk.Button(input_frame, text="Quit", command=quit_game).pack(side=tk.LEFT, padx=5)

    listbox = tk.Listbox(input_frame, height=5, width=20)
    listbox.pack(side=tk.LEFT, padx=5)
    listbox.bind("<Double-1>", on_select)
    listbox.bind("<ButtonRelease-1>", on_select)

    entry.bind("<KeyRelease>", update_suggestions)

    guesses_frame = tk.Frame(game_window)
    guesses_frame.pack(fill=tk.BOTH, expand=True, pady=5)

    guesses_canvas = tk.Canvas(guesses_frame, bg="lightgrey")
    guesses_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

    scrollbar = tk.Scrollbar(guesses_frame, orient=tk.VERTICAL, command=guesses_canvas.yview)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    guesses_canvas.configure(yscrollcommand=scrollbar.set)

    guesses_canvas_frame = tk.Frame(guesses_canvas, bg="white")
    guesses_canvas.create_window((0, 0), window=guesses_canvas_frame, anchor="nw")

    guesses_canvas.bind("<Configure>", lambda e: guesses_canvas.configure(scrollregion=guesses_canvas.bbox("all")))

     # Add column headers above the guess boxes
    header_frame = tk.Frame(guesses_canvas_frame, bg="lightgrey")
    header_frame.pack(fill=tk.X, pady=5)

    # Add the first column (guessed value column)
    tk.Label(header_frame, text=data.columns[0], width=20, anchor="w", bg="lightgrey").pack(side=tk.LEFT, padx=5)

    # Add headers for remaining columns
    for col_name in data.columns[1:]:
        tk.Label(header_frame, text=col_name, width=12, anchor="center", bg="lightgrey").pack(side=tk.LEFT, padx=2)

    game_window.mainloop()

def main():
    print("Select the CSV file to process.")
    file_path = select_file()

    if file_path:
        print(f"Processing file: {file_path}")
        result = read_csv_until_missing(file_path)

        if result is not None:
            print("Processed DataFrame:")
            print(result)
            start_game(result)
        else:
            print("Failed to process the file.")
    else:
        print("No file selected.")

if __name__ == "__main__":
    main()
