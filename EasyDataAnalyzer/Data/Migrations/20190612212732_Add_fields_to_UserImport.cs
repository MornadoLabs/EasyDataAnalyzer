using Microsoft.EntityFrameworkCore.Migrations;

namespace EasyDataAnalyzer.Data.Migrations
{
    public partial class Add_fields_to_UserImport : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ErrorsCount",
                table: "UserImports",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "UserImports",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ErrorsCount",
                table: "UserImports");

            migrationBuilder.DropColumn(
                name: "FileName",
                table: "UserImports");
        }
    }
}
