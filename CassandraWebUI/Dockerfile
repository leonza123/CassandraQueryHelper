#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["CassandraWebUI/CassandraWebUI.csproj", "CassandraWebUI/"]
RUN dotnet restore "CassandraWebUI/CassandraWebUI.csproj"
COPY . .
WORKDIR "/src/CassandraWebUI"
RUN dotnet build "CassandraWebUI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CassandraWebUI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CassandraWebUI.dll"]