using Microsoft.EntityFrameworkCore.Migrations;

namespace EasyDataAnalyzer.Data.Migrations
{
    public partial class Make_Import_Value_and_Params_Nullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ParameterValue",
                table: "ImportParameters",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "ImportData",
                nullable: true,
                oldClrType: typeof(string));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ParameterValue",
                table: "ImportParameters",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "ImportData",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
