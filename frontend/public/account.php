<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Library - Account Management</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
    />
    <link rel="stylesheet" href="../../system/assets/css/nav.css" />
    <link rel="stylesheet" href="../../system/assets/css/dashboard.css" />
  </head>

  <body class="bg-body-tertiary">
    <?php include("../../backend/controllers/account.php"); ?>
    <?php include("../../system/includes/navigation.php"); ?>
    <div class="container mt-3 pt-5 page-content">
      <h1 class="mb-4 text-primary text-center">Pending Accounts</h1>

      <?php if (!empty($message)) echo $message; ?>

      <div class="card shadow-sm">
        <div class="card-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($pendingAccounts as $row): ?>
              <tr>
                <td><?php echo $row['id']; ?></td>
                <td><?php echo htmlspecialchars($row['fname']); ?></td>
                <td><?php echo htmlspecialchars($row['lname']); ?></td>
                <td><?php echo htmlspecialchars($row['email']); ?></td>
                <td>
                  <form method="post" style="display: inline;">
                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                    <button type="submit" name="approve" class="btn btn-success btn-sm">Approve</button>
                  </form>
                  <form method="post" style="display: inline;">
                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                    <button type="submit" name="delete" class="btn btn-danger btn-sm">Delete</button>
                  </form>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</html>