using Microsoft.EntityFrameworkCore.Migrations;

namespace EasyDataAnalyzer.Data.Migrations
{
    public partial class Make_FileName_required_in_UserImport : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "UserImports",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "UserImports",
                nullable: true,
                oldClrType: typeof(string));
        }
    }
}
