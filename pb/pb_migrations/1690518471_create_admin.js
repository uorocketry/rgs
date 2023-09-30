migrate(
  (db) => {
    const admin = new Admin();

    admin.email = "admin@admin.com";
    admin.setPassword("admin");

    return Dao(db).saveAdmin(admin);
  },
  (db) => {
    const dao = new Dao(db);

    const admin = dao.findAdminByEmail("test@example.com");

    return dao.deleteAdmin(admin);
  }
);
