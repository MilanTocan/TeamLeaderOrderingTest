# Teamleader Ordering Test
Teamleader programming test 2 implemented in React (with ASP.NET core 2.1 backend)

In the root of the solution you'll find the `appsetting.json` file, you'll need to edit the ConnectionString property in order to setup the API.
```sh
"ConnectionString": {
    "Ordering": "Data Source=DESKTOP-J2V7BBN\\SQLEXPRESS;Initial Catalog=Ordering;Persist Security Info=True;User ID=sa;Password=******"
}
```

Once this is done you use the `Update-Database` command in the Package Manager Console to create and seed the database.

# Features
- Single Page application
- Functional Components and PureComponents
- Strict validation
- Simple basic API for testing purposes