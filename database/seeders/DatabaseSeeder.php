<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar utilizador admin para testes
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@inovtodo.com',
            'password' => bcrypt('password'), // Senha: password
        ]);

        // Criar algumas tarefas de exemplo para o admin
        $admin->tasks()->createMany([
            [
                'title' => 'Completar documentação do projeto',
                'description' => 'Escrever a documentação completa da API e componentes',
                'due_date' => now()->addDays(7),
                'priority' => 'high',
                'is_completed' => false,
            ],
            [
                'title' => 'Revisar código do frontend',
                'description' => 'Fazer code review dos componentes Vue',
                'due_date' => now()->addDays(3),
                'priority' => 'medium',
                'is_completed' => false,
            ],
            [
                'title' => 'Configurar ambiente de produção',
                'description' => 'Preparar servidor e deploy da aplicação',
                'due_date' => now()->addDays(14),
                'priority' => 'high',
                'is_completed' => false,
            ],
            [
                'title' => 'Testar funcionalidades',
                'description' => 'Executar testes manuais de todas as funcionalidades',
                'due_date' => now()->subDays(2), // Tarefa atrasada
                'priority' => 'high',
                'is_completed' => false,
            ],
            [
                'title' => 'Reunião com equipa',
                'description' => 'Apresentar progresso do projeto',
                'due_date' => now()->addDays(1),
                'priority' => 'medium',
                'is_completed' => true,
            ],
        ]);

        // Criar utilizador de teste adicional
        $testUser = User::factory()->create([
            'name' => 'Teste Utilizador',
            'email' => 'teste@inovtodo.com',
            'password' => bcrypt('password'), // Senha: password
        ]);

        // Criar algumas tarefas para o utilizador de teste
        $testUser->tasks()->createMany([
            [
                'title' => 'Comprar mantimentos',
                'description' => 'Ir ao supermercado',
                'due_date' => now()->addDays(1),
                'priority' => 'low',
                'is_completed' => false,
            ],
            [
                'title' => 'Estudar Laravel',
                'description' => 'Completar curso de Laravel',
                'due_date' => now()->addDays(5),
                'priority' => 'medium',
                'is_completed' => false,
            ],
        ]);
    }
}
