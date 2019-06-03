using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace EasyDataAnalyzer.Data.Migrations
{
    public partial class InitMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AnalysisHistory",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AnalysisDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalysisHistory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DataPriorityLevels",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Description = table.Column<string>(maxLength: 450, nullable: false),
                    Priority = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataPriorityLevels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DataTypes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Description = table.Column<string>(maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserImports",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(nullable: false),
                    RecordsCount = table.Column<long>(nullable: false),
                    ImportDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserImports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserImports_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnalysisData",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AnalysisHistoryId = table.Column<long>(nullable: false),
                    ImportId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalysisData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnalysisData_AnalysisHistory_AnalysisHistoryId",
                        column: x => x.AnalysisHistoryId,
                        principalTable: "AnalysisHistory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnalysisData_UserImports_ImportId",
                        column: x => x.ImportId,
                        principalTable: "UserImports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ImportHeaders",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ImportId = table.Column<long>(nullable: false),
                    HeaderName = table.Column<string>(nullable: false),
                    DataTypeId = table.Column<int>(nullable: false),
                    PriorityLevelId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportHeaders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImportHeaders_DataTypes_DataTypeId",
                        column: x => x.DataTypeId,
                        principalTable: "DataTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ImportHeaders_UserImports_ImportId",
                        column: x => x.ImportId,
                        principalTable: "UserImports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ImportHeaders_DataPriorityLevels_PriorityLevelId",
                        column: x => x.PriorityLevelId,
                        principalTable: "DataPriorityLevels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ImportParameters",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ImportId = table.Column<long>(nullable: false),
                    ParameterName = table.Column<string>(nullable: false),
                    ParameterValue = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportParameters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImportParameters_UserImports_ImportId",
                        column: x => x.ImportId,
                        principalTable: "UserImports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ImportData",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    HeaderId = table.Column<int>(nullable: false),
                    RowNumber = table.Column<long>(nullable: false),
                    Value = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImportData_ImportHeaders_HeaderId",
                        column: x => x.HeaderId,
                        principalTable: "ImportHeaders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnalysisData_AnalysisHistoryId",
                table: "AnalysisData",
                column: "AnalysisHistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_AnalysisData_ImportId",
                table: "AnalysisData",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportData_HeaderId",
                table: "ImportData",
                column: "HeaderId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportHeaders_DataTypeId",
                table: "ImportHeaders",
                column: "DataTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportHeaders_ImportId",
                table: "ImportHeaders",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportHeaders_PriorityLevelId",
                table: "ImportHeaders",
                column: "PriorityLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportParameters_ImportId",
                table: "ImportParameters",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_UserImports_UserId",
                table: "UserImports",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnalysisData");

            migrationBuilder.DropTable(
                name: "ImportData");

            migrationBuilder.DropTable(
                name: "ImportParameters");

            migrationBuilder.DropTable(
                name: "AnalysisHistory");

            migrationBuilder.DropTable(
                name: "ImportHeaders");

            migrationBuilder.DropTable(
                name: "DataTypes");

            migrationBuilder.DropTable(
                name: "UserImports");

            migrationBuilder.DropTable(
                name: "DataPriorityLevels");
        }
    }
}
