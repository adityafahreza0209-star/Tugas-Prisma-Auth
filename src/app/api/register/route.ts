import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
            { error: "Semua data wajib diisi" },
            { status: 400 }
            );
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({
        where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
            { error: "Email sudah terdaftar" },
            { status: 400 }
            );
        }

        // Hash kata sandi
        const hashedPassword = await hash(password, 10);

        // Simpan pengguna baru ke database
        const user=await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "Pendaftaran berhasil", user },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            { error: "Gagal memproses pendaftaran" },
            { status: 500 }
        );
    }
}