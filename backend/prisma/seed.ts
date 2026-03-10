import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const peru = await tx.plant.upsert({
            where: { name: "Perú (planta)" },
            update: {},
            create: { name: "Perú (planta)" },
        });

        const colombia = await tx.plant.upsert({
            where: { name: "Colombia (planta)" },
            update: {},
            create: { name: "Colombia (planta)" },
        });

        const chile = await tx.plant.upsert({
            where: { name: "Chile (planta)" },
            update: {},
            create: { name: "Chile (planta)" },
        });

        const operationNames = [
            "Precios Base",
            "Waste",
            "Costos indirectos",
            "Clientes",
            "Comisiones",
            "Tipos de cambio",
            "Tasa financiera anual",
            "Logística",
            "Embalaje especial",
        ];

        for (let i = 0; i < operationNames.length; i++) {
            await tx.operation.upsert({
                where: { name: operationNames[i] },
                update: { order: i + 1 },
                create: { name: operationNames[i], order: i + 1 },
            });
        }

        const tipoA = await tx.clientType.upsert({
            where: { name: "Tipo A" },
            update: {},
            create: {
                name: "Tipo A",
                pricePerColor: 250,
                priceLinkType: "Por estructura",
            },
        });

        const tipoB = await tx.clientType.upsert({
            where: { name: "Tipo B" },
            update: {},
            create: {
                name: "Tipo B",
                pricePerColor: 300,
                priceLinkType: "Por estructura",
            },
        });

        const tipoC = await tx.clientType.upsert({
            where: { name: "Tipo C" },
            update: {},
            create: {
                name: "Tipo C",
                pricePerColor: 350,
                priceLinkType: "Por estructura",
            },
        });

        const sinTipo = await tx.clientType.upsert({
            where: { name: "Sin tipo de cliente" },
            update: {},
            create: {
                name: "Sin tipo de cliente",
                pricePerColor: 350,
                priceLinkType: "Por estructura",
            },
        });

        const clientsData = [
            { name: "KROWDY", typeId: tipoA.id, price: 250, link: "Por estructura" },
            { name: "DEVELOP INC", typeId: tipoA.id, price: 200, link: "No vincular" },
            { name: "SONAR INC", typeId: tipoA.id, price: 250, link: "Por estructura" },
            { name: "NEXUS CORP", typeId: tipoB.id, price: 300, link: "Por estructura" },
            { name: "VORTEX SA", typeId: tipoB.id, price: 280, link: "Por estructura" },
            { name: "ARKANA GROUP", typeId: tipoB.id, price: 310, link: "No vincular" },
            { name: "GLOBAL TECH", typeId: tipoC.id, price: 350, link: "Por estructura" },
            { name: "PRIME SOLUTIONS", typeId: tipoC.id, price: 340, link: "Por estructura" },
            { name: "VERTEX LABS", typeId: tipoC.id, price: 360, link: "No vincular" },
            { name: "INDIE MARKET", typeId: sinTipo.id, price: 350, link: "Por estructura" },
            { name: "NOVA TRADING", typeId: sinTipo.id, price: 330, link: "Por estructura" },
            { name: "RAYO EXPRESS", typeId: sinTipo.id, price: 370, link: "No vincular" },
        ];

        const clients: Record<string, { id: string }> = {};

        for (const c of clientsData) {
            clients[c.name] = await tx.client.upsert({
                where: { name_clientTypeId: { name: c.name, clientTypeId: c.typeId } },
                update: {},
                create: {
                    name: c.name,
                    clientTypeId: c.typeId,
                    pricePerColor: c.price,
                    priceLinkType: c.link,
                },
            });
        }

        const allMargins = [
            // ── Perú: ClientType headers ──
            { plantId: peru.id, clientTypeId: tipoA.id, clientId: null, vol300: 15, vol500: 15, vol1T: 15, vol3T: 15, vol5T: 15, vol10T: 15, vol20T: 15, vol30T: 15, isOverride: false },
            { plantId: peru.id, clientTypeId: tipoB.id, clientId: null, vol300: 20, vol500: 20, vol1T: 20, vol3T: 20, vol5T: 20, vol10T: 14, vol20T: 20, vol30T: 20, isOverride: false },
            { plantId: peru.id, clientTypeId: tipoC.id, clientId: null, vol300: 25, vol500: 25, vol1T: 25, vol3T: 25, vol5T: 25, vol10T: 25, vol20T: 25, vol30T: 25, isOverride: false },
            { plantId: peru.id, clientTypeId: sinTipo.id, clientId: null, vol300: 30, vol500: 30, vol1T: 30, vol3T: 30, vol5T: 30, vol10T: 30, vol20T: 30, vol30T: 30, isOverride: false },

            // ── Perú: Tipo A clients ──
            { plantId: peru.id, clientTypeId: null, clientId: clients["KROWDY"].id, vol300: 15, vol500: 15, vol1T: 15, vol3T: 15, vol5T: 15, vol10T: 15, vol20T: 15, vol30T: 15, isOverride: false },
            { plantId: peru.id, clientTypeId: null, clientId: clients["DEVELOP INC"].id, vol300: 15, vol500: 15, vol1T: 15, vol3T: 1, vol5T: 14, vol10T: 20, vol20T: 15, vol30T: 15, isOverride: true },
            { plantId: peru.id, clientTypeId: null, clientId: clients["SONAR INC"].id, vol300: 15, vol500: 15, vol1T: 15, vol3T: 15, vol5T: 15, vol10T: 15, vol20T: 15, vol30T: 15, isOverride: false },

            // ── Perú: Tipo B clients ──
            { plantId: peru.id, clientTypeId: null, clientId: clients["NEXUS CORP"].id, vol300: 20, vol500: 20, vol1T: 20, vol3T: 20, vol5T: 20, vol10T: 14, vol20T: 20, vol30T: 20, isOverride: false },
            { plantId: peru.id, clientTypeId: null, clientId: clients["VORTEX SA"].id, vol300: 20, vol500: 20, vol1T: 20, vol3T: 20, vol5T: 18, vol10T: 12, vol20T: 20, vol30T: 20, isOverride: true },
            { plantId: peru.id, clientTypeId: null, clientId: clients["ARKANA GROUP"].id, vol300: 20, vol500: 20, vol1T: 20, vol3T: 20, vol5T: 20, vol10T: 14, vol20T: 20, vol30T: 20, isOverride: false },

            // ── Perú: Tipo C clients ──
            { plantId: peru.id, clientTypeId: null, clientId: clients["GLOBAL TECH"].id, vol300: 25, vol500: 25, vol1T: 25, vol3T: 25, vol5T: 25, vol10T: 25, vol20T: 25, vol30T: 25, isOverride: false },
            { plantId: peru.id, clientTypeId: null, clientId: clients["PRIME SOLUTIONS"].id, vol300: 25, vol500: 25, vol1T: 25, vol3T: 25, vol5T: 25, vol10T: 25, vol20T: 25, vol30T: 25, isOverride: false },
            { plantId: peru.id, clientTypeId: null, clientId: clients["VERTEX LABS"].id, vol300: 25, vol500: 22, vol1T: 20, vol3T: 18, vol5T: 15, vol10T: 12, vol20T: 10, vol30T: 8, isOverride: true },

            // ── Perú: Sin tipo clients ──
            { plantId: peru.id, clientTypeId: null, clientId: clients["INDIE MARKET"].id, vol300: 30, vol500: 30, vol1T: 30, vol3T: 30, vol5T: 30, vol10T: 30, vol20T: 30, vol30T: 30, isOverride: false },
            { plantId: peru.id, clientTypeId: null, clientId: clients["NOVA TRADING"].id, vol300: 30, vol500: 30, vol1T: 30, vol3T: 28, vol5T: 25, vol10T: 22, vol20T: 20, vol30T: 18, isOverride: true },
            { plantId: peru.id, clientTypeId: null, clientId: clients["RAYO EXPRESS"].id, vol300: 30, vol500: 30, vol1T: 30, vol3T: 30, vol5T: 30, vol10T: 30, vol20T: 30, vol30T: 30, isOverride: false },

            // ── Colombia: ClientType headers ──
            { plantId: colombia.id, clientTypeId: tipoA.id, clientId: null, vol300: 12, vol500: 12, vol1T: 12, vol3T: 12, vol5T: 12, vol10T: 12, vol20T: 12, vol30T: 12, isOverride: false },
            { plantId: colombia.id, clientTypeId: tipoB.id, clientId: null, vol300: 18, vol500: 18, vol1T: 18, vol3T: 18, vol5T: 18, vol10T: 16, vol20T: 18, vol30T: 18, isOverride: false },
            { plantId: colombia.id, clientTypeId: tipoC.id, clientId: null, vol300: 22, vol500: 22, vol1T: 22, vol3T: 22, vol5T: 22, vol10T: 22, vol20T: 22, vol30T: 22, isOverride: false },
            { plantId: colombia.id, clientTypeId: sinTipo.id, clientId: null, vol300: 28, vol500: 28, vol1T: 28, vol3T: 28, vol5T: 28, vol10T: 28, vol20T: 28, vol30T: 28, isOverride: false },

            // ── Colombia: sample client overrides ──
            { plantId: colombia.id, clientTypeId: null, clientId: clients["KROWDY"].id, vol300: 12, vol500: 12, vol1T: 12, vol3T: 10, vol5T: 8, vol10T: 6, vol20T: 4, vol30T: 3, isOverride: true },
            { plantId: colombia.id, clientTypeId: null, clientId: clients["NEXUS CORP"].id, vol300: 18, vol500: 18, vol1T: 18, vol3T: 18, vol5T: 18, vol10T: 16, vol20T: 18, vol30T: 18, isOverride: false },
            { plantId: colombia.id, clientTypeId: null, clientId: clients["INDIE MARKET"].id, vol300: 28, vol500: 28, vol1T: 28, vol3T: 28, vol5T: 28, vol10T: 28, vol20T: 28, vol30T: 28, isOverride: false },

            // ── Chile: ClientType headers ──
            { plantId: chile.id, clientTypeId: tipoA.id, clientId: null, vol300: 10, vol500: 10, vol1T: 10, vol3T: 10, vol5T: 10, vol10T: 10, vol20T: 10, vol30T: 10, isOverride: false },
            { plantId: chile.id, clientTypeId: tipoB.id, clientId: null, vol300: 16, vol500: 16, vol1T: 16, vol3T: 16, vol5T: 16, vol10T: 14, vol20T: 16, vol30T: 16, isOverride: false },
            { plantId: chile.id, clientTypeId: tipoC.id, clientId: null, vol300: 20, vol500: 20, vol1T: 20, vol3T: 20, vol5T: 20, vol10T: 20, vol20T: 20, vol30T: 20, isOverride: false },
            { plantId: chile.id, clientTypeId: sinTipo.id, clientId: null, vol300: 25, vol500: 25, vol1T: 25, vol3T: 25, vol5T: 25, vol10T: 25, vol20T: 25, vol30T: 25, isOverride: false },

            // ── Chile: sample client overrides ──
            { plantId: chile.id, clientTypeId: null, clientId: clients["SONAR INC"].id, vol300: 10, vol500: 10, vol1T: 10, vol3T: 10, vol5T: 8, vol10T: 5, vol20T: 3, vol30T: 2, isOverride: true },
            { plantId: chile.id, clientTypeId: null, clientId: clients["GLOBAL TECH"].id, vol300: 20, vol500: 20, vol1T: 20, vol3T: 20, vol5T: 20, vol10T: 20, vol20T: 20, vol30T: 20, isOverride: false },
            { plantId: chile.id, clientTypeId: null, clientId: clients["RAYO EXPRESS"].id, vol300: 25, vol500: 25, vol1T: 25, vol3T: 25, vol5T: 25, vol10T: 25, vol20T: 25, vol30T: 25, isOverride: false },
        ];

        for (const m of allMargins) {
            await tx.marginConfig.upsert({
                where: {
                    plantId_clientTypeId_clientId: {
                        plantId: m.plantId,
                        clientTypeId: m.clientTypeId ?? "",
                        clientId: m.clientId ?? "",
                    },
                },
                update: {
                    vol300: m.vol300, vol500: m.vol500, vol1T: m.vol1T, vol3T: m.vol3T,
                    vol5T: m.vol5T, vol10T: m.vol10T, vol20T: m.vol20T, vol30T: m.vol30T,
                    isOverride: m.isOverride,
                },
                create: {
                    plantId: m.plantId,
                    clientTypeId: m.clientTypeId,
                    clientId: m.clientId,
                    vol300: m.vol300, vol500: m.vol500, vol1T: m.vol1T, vol3T: m.vol3T,
                    vol5T: m.vol5T, vol10T: m.vol10T, vol20T: m.vol20T, vol30T: m.vol30T,
                    isOverride: m.isOverride,
                },
            });
        }

        const indirectCostsData = [
            { plantId: peru.id, name: "Alquiler", amount: 15000.0 },
            { plantId: peru.id, name: "Luz", amount: 8500.5 },
            { plantId: peru.id, name: "Agua", amount: 3200.0 },
            { plantId: colombia.id, name: "Alquiler", amount: 12000.0 },
            { plantId: colombia.id, name: "Luz", amount: 7200.0 },
            { plantId: colombia.id, name: "Agua", amount: 2800.0 },
            { plantId: colombia.id, name: "Mantenimiento", amount: 4500.0 },
            { plantId: chile.id, name: "Alquiler", amount: 18000.0 },
            { plantId: chile.id, name: "Luz", amount: 9100.0 },
            { plantId: chile.id, name: "Agua", amount: 3800.0 },
        ];

        for (const cost of indirectCostsData) {
            await tx.indirectCost.upsert({
                where: { plantId_name: { plantId: cost.plantId, name: cost.name } },
                update: { amount: cost.amount },
                create: { plantId: cost.plantId, name: cost.name, amount: cost.amount },
            });
        }
    });

    console.log("Seed completed successfully");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
