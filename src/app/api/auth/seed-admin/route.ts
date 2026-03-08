import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: 'admin@bpm-unsur.com' }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin user already exists',
        user: {
          email: existingAdmin.email,
          fullName: existingAdmin.fullName,
          role: existingAdmin.role
        }
      });
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create default admin user
    const admin = await db.user.create({
      data: {
        email: 'admin@bpm-unsur.com',
        password: hashedPassword,
        fullName: 'Administrator',
        role: 'admin',
        isActive: true,
      }
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role
      },
      defaultPassword: 'admin123'
    });
  } catch (error) {
    console.error('Seed admin error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if admin exists
export async function GET() {
  try {
    const adminCount = await db.user.count({
      where: { role: 'admin' }
    });

    return NextResponse.json({
      hasAdmin: adminCount > 0,
      adminCount
    });
  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { error: 'Failed to check admin users' },
      { status: 500 }
    );
  }
}
