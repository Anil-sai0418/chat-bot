const fs = require('fs');
const path = require('path');
const db = require('./db');

/**
 * Initialize the database by running the SQL schema
 * This function:
 * 1. Checks if required tables exist
 * 2. Creates tables if they don't exist
 * 3. Initializes default data
 */
async function initDatabase() {
    try {
        console.log('🔄 Starting database initialization...');

        // Read the SQL schema file
        const sqlFilePath = path.join(__dirname, 'database.sql');
        const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

        // Split SQL statements and filter empty ones
        const statements = sqlScript
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        // Execute each SQL statement
        for (const statement of statements) {
            try {
                await db.query(statement);
                console.log('✅ Executed:', statement.substring(0, 50) + '...');
            } catch (error) {
                // Some errors are acceptable (e.g., duplicate index)
                if (error.code !== '42P07') { // 42P07 = duplicate table/index
                    console.warn('⚠️  SQL Warning:', error.message);
                }
            }
        }

        console.log('✅ Database schema initialized successfully');

        // Initialize default data
        await initializeDefaultData();
        
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        throw error;
    }
}

/**
 * Initialize default data in the database
 */
async function initializeDefaultData() {
    try {
        console.log('🔄 Initializing default data...');

        // Initialize visitor_count if not exists
        const visitorCheck = await db.query(
            "SELECT value FROM site_stats WHERE key = 'visitor_count'"
        );

        if (visitorCheck.rows.length === 0) {
            await db.query(
                "INSERT INTO site_stats (key, value) VALUES ('visitor_count', 0)"
            );
            console.log('✅ Visitor count initialized');
        }

        // Create or verify dummy user exists
        const dummyUserCheck = await db.query(
            'SELECT id FROM users WHERE username = $1',
            ['dummy_user']
        );

        if (dummyUserCheck.rows.length === 0) {
            await db.query(
                'INSERT INTO users (username, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5)',
                ['dummy_user', 'hello@anilsai.com', 'Anil', 'Sai', 'dummy_password_hash']
            );
            console.log('✅ Dummy user created');
        } else {
            console.log('✅ Dummy user already exists');
        }

        console.log('✅ Default data initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing default data:', error.message);
        throw error;
    }
}

/**
 * Check if required tables exist
 * Returns true if all tables are present
 */
async function checkDatabaseTables() {
    try {
        const requiredTables = ['users', 'chats', 'messages', 'site_stats'];
        const missingTables = [];

        for (const table of requiredTables) {
            const result = await db.query(`
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = $1
                )
            `, [table]);

            if (!result.rows[0].exists) {
                missingTables.push(table);
            }
        }

        if (missingTables.length > 0) {
            console.warn(`⚠️  Missing tables: ${missingTables.join(', ')}`);
            return false;
        }

        console.log('✅ All required tables exist');
        return true;
    } catch (error) {
        console.error('❌ Error checking database tables:', error.message);
        throw error;
    }
}

module.exports = {
    initDatabase,
    checkDatabaseTables,
    initializeDefaultData,
};
