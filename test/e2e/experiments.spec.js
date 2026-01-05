import { test, expect } from '@playwright/test';

test.describe('Experimentos do BioLab', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para o jogo
    await page.goto('http://localhost:3000');
    
    // Aguardar carregamento
    await page.waitForSelector('[data-testid="lab-station"]', { timeout: 10000 });
  });

  test('Deve iniciar um experimento de cultivo', async ({ page }) => {
    // Navegar para experimentos
    await page.click('[data-testid="nav-experiments"]');
    
    // Encontrar e clicar no experimento de cultivo
    const cultureExperiment = page.locator('[data-testid="experiment-culture_growth"]');
    await expect(cultureExperiment).toBeVisible();
    await cultureExperiment.click();
    
    // Verificar se o quiz modal aparece
    const quizModal = page.locator('[data-testid="quiz-modal"]');
    await expect(quizModal).toBeVisible();
    
    // Responder perguntas do quiz
    const firstOption = page.locator('[data-testid="quiz-option-0"]').first();
    await firstOption.click();
    
    const confirmButton = page.locator('button:has-text("CONFIRMAR RESPOSTA")');
    await confirmButton.click();
    
    // Aguardar próxima pergunta ou conclusão
    await page.waitForTimeout(1000);
    
    // Se houver mais perguntas, responder
    const nextQuestion = page.locator('button:has-text("PRÓXIMA PERGUNTA")');
    if (await nextQuestion.isVisible()) {
      await nextQuestion.click();
      // Responder mais uma
      const secondOption = page.locator('[data-testid="quiz-option-1"]').first();
      await secondOption.click();
      await confirmButton.click();
    }
    
    // Verificar se o minigame inicia
    const minigame = page.locator('[data-testid="culture-growth-minigame"]');
    await expect(minigame).toBeVisible({ timeout: 5000 });
    
    // Interagir com o minigame (simulação básica)
    const gridCells = page.locator('[data-testid="culture-cell"]');
    await expect(gridCells).toHaveCount(25);
    
    // Clicar em algumas células
    await gridCells.first().click();
    await gridCells.nth(5).click();
    await gridCells.nth(10).click();
    
    // Completar o experimento
    const completeButton = page.locator('button:has-text("CONCLUIR EXPERIMENTO")');
    await completeButton.click();
    
    // Verificar recompensas
    const rewardsModal = page.locator('[data-testid="experiment-results"]');
    await expect(rewardsModal).toBeVisible();
    
    const knowledgeGain = page.locator('text=/\\+\\d+ Conhecimento/');
    await expect(knowledgeGain).toBeVisible();
  });

  test('Deve comprar equipamento na loja', async ({ page }) => {
    // Navegar para loja
    await page.click('[data-testid="nav-shop"]');
    
    // Verificar equipamentos disponíveis
    const equipmentCards = page.locator('[data-testid="equipment-card"]');
    await expect(equipmentCards).toHaveCountGreaterThan(0);
    
    // Encontrar um equipamento acessível
    const affordableEquipment = page.locator('[data-testid="equipment-card"]:has-text("COMPRAR")').first();
    if (await affordableEquipment.isVisible()) {
      await affordableEquipment.click();
      
      // Verificar confirmação
      const confirmation = page.locator('text=/Equipamento adquirido/');
      await expect(confirmation).toBeVisible({ timeout: 3000 });
      
      // Verificar se aparece como adquirido
      const ownedBadge = page.locator('text=/✓ ADQUIRIDO/');
      await expect(ownedBadge).toBeVisible();
    }
  });

  test('Deve verificar progresso e estatísticas', async ({ page }) => {
    // Navegar para progresso
    await page.click('[data-testid="nav-progress"]');
    
    // Verificar painel de estatísticas
    const statsPanel = page.locator('[data-testid="stats-panel"]');
    await expect(statsPanel).toBeVisible();
    
    // Verificar métricas
    const knowledgeStat = page.locator('text=/Conhecimento/');
    await expect(knowledgeStat).toBeVisible();
    
    const fundingStat = page.locator('text=/Financiamento/');
    await expect(fundingStat).toBeVisible();
    
    const reputationStat = page.locator('text=/Reputação/');
    await expect(reputationStat).toBeVisible();
    
    // Verificar gráficos ou progress bars
    const progressBars = page.locator('[data-testid="progress-bar"]');
    await expect(progressBars).toHaveCountGreaterThan(0);
  });

  test('Deve responder perguntas do quiz corretamente', async ({ page }) => {
    // Iniciar um experimento que requer quiz
    await page.click('[data-testid="nav-experiments"]');
    await page.click('[data-testid="experiment-culture_growth"]');
    
    // Capturar todas as perguntas
    const questions = page.locator('[data-testid="quiz-question"]');
    const questionCount = await questions.count();
    
    for (let i = 0; i < questionCount; i++) {
      // Encontrar a pergunta atual
      const currentQuestion = questions.nth(i);
      await expect(currentQuestion).toBeVisible();
      
      // Ler a pergunta
      const questionText = await currentQuestion.textContent();
      
      // Baseado no conteúdo da pergunta, selecionar resposta
      if (questionText.includes('glicose') || questionText.includes('Glicose')) {
        await page.click('[data-testid="quiz-option-0"]');
      } else if (questionText.includes('temperatura') || questionText.includes('95')) {
        await page.click('[data-testid="quiz-option-2"]');
      } else {
        // Selecionar primeira opção por padrão
        await page.click('[data-testid="quiz-option-0"]');
      }
      
      // Confirmar resposta
      await page.click('button:has-text("CONFIRMAR RESPOSTA")');
      
      // Aguardar feedback
      await page.waitForTimeout(500);
      
      // Ir para próxima pergunta se existir
      const nextButton = page.locator('button:has-text("PRÓXIMA PERGUNTA")');
      if (await nextButton.isVisible() && i < questionCount - 1) {
        await nextButton.click();
      }
    }
    
    // Verificar resultados do quiz
    const quizResults = page.locator('[data-testid="quiz-results"]');
    await expect(quizResults).toBeVisible({ timeout: 5000 });
    
    const passedText = page.locator('text=/Aprovado|Sucesso/');
    await expect(passedText).toBeVisible();
  });

  test('Deve navegar por todas as seções principais', async ({ page }) => {
    const sections = [
      { testId: 'nav-lab', name: 'Laboratório' },
      { testId: 'nav-experiments', name: 'Experimentos' },
      { testId: 'nav-shop', name: 'Loja' },
      { testId: 'nav-progress', name: 'Progresso' },
      { testId: 'nav-learn', name: 'Aprendizado' },
    ];
    
    for (const section of sections) {
      // Navegar para a seção
      await page.click(`[data-testid="${section.testId}"]`);
      
      // Verificar conteúdo específico da seção
      const sectionContent = page.locator(`[data-testid="${section.testId}-content"]`);
      await expect(sectionContent).toBeVisible({ timeout: 3000 });
      
      // Verificar título ou heading
      const sectionTitle = page.locator('h1, h2, h3').filter({ hasText: new RegExp(section.name, 'i') });
      await expect(sectionTitle).toBeVisible();
      
      // Pequena pausa para visualização (opcional)
      await page.waitForTimeout(500);
    }
  });

  test('Deve salvar e carregar progresso', async ({ page }) => {
    // Realizar alguma ação que modifica o estado
    const initialKnowledge = await page.locator('[data-testid="knowledge-value"]').textContent();
    
    // Completar uma ação simples
    await page.click('[data-testid="nav-experiments"]');
    await page.click('[data-testid="experiment-culture_growth"]');
    
    // Pular quiz para teste rápido
    const skipButton = page.locator('button:has-text("PULAR")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Recarregar página
    await page.reload();
    await page.waitForSelector('[data-testid="lab-station"]', { timeout: 10000 });
    
    // Verificar se o conhecimento foi mantido
    const newKnowledge = await page.locator('[data-testid="knowledge-value"]').textContent();
    
    // O conhecimento deve ser igual ou maior (se ganhou algum durante o teste)
    expect(parseInt(newKnowledge)).toBeGreaterThanOrEqual(parseInt(initialKnowledge));
  });

  test('Deve interagir com o sistema de conquistas', async ({ page }) => {
    // Navegar para conquistas
    await page.click('[data-testid="nav-progress"]');
    const achievementsTab = page.locator('button:has-text("Conquistas")');
    await achievementsTab.click();
    
    // Verificar lista de conquistas
    const achievements = page.locator('[data-testid="achievement-card"]');
    await expect(achievements).toHaveCountGreaterThan(0);
    
    // Verificar conquistas desbloqueadas
    const unlockedAchievements = page.locator('[data-testid="achievement-unlocked"]');
    const unlockedCount = await unlockedAchievements.count();
    
    // Verificar progresso de conquistas
    const achievementProgress = page.locator('[data-testid="achievement-progress"]');
    await expect(achievementProgress).toHaveCountGreaterThan(0);
    
    // Clicar em uma conquista para ver detalhes
    await achievements.first().click();
    
    // Verificar modal de detalhes
    const achievementDetails = page.locator('[data-testid="achievement-details"]');
    await expect(achievementDetails).toBeVisible();
  });

  test('Deve usar o sistema de patentes', async ({ page }) => {
    // Pré-requisito: ter conhecimento suficiente
    const currentKnowledge = await page.locator('[data-testid="knowledge-value"]').textContent();
    
    if (parseInt(currentKnowledge) >= 500) {
      // Navegar para patentes
      await page.click('[data-testid="nav-progress"]');
      const patentsTab = page.locator('button:has-text("Patentes")');
      await patentsTab.click();
      
      // Verificar patentes disponíveis
      const availablePatents = page.locator('[data-testid="patent-card"]:has-text("REGISTRAR")');
      if (await availablePatents.first().isVisible()) {
        await availablePatents.first().click();
        
        // Confirmar registro
        const confirmButton = page.locator('button:has-text("CONFIRMAR")');
        await confirmButton.click();
        
        // Verificar confirmação
        const successMessage = page.locator('text=/Patente registrada/');
        await expect(successMessage).toBeVisible({ timeout: 5000 });
      }
    }
  });
});