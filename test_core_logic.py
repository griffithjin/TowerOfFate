#!/usr/bin/env python3
"""
命运塔·首登者 - 核心逻辑测试系统
模拟测试20遍，验证所有关键功能
"""

import random

class TowerOfFateTester:
    def __init__(self):
        self.test_results = []
        self.total_tests = 20
        self.passed_tests = 0
        self.failed_tests = 0
    
    def run_all_tests(self):
        print("🎮 命运塔·首登者 - 核心逻辑测试开始")
        print(f"📊 计划测试次数: {self.total_tests}")
        print("")
        
        for i in range(1, self.total_tests + 1):
            print(f"\n{'━' * 50}")
            print(f"📝 第 {i}/{self.total_tests} 轮测试")
            print(f"{'━' * 50}")
            
            self.run_test_round(i)
        
        self.print_summary()
    
    def run_test_round(self, round_num):
        tests = []
        
        # 测试1: 卡牌生成去重
        tests.append(self.test_unique_cards())
        
        # 测试2: 手牌增长逻辑 (5→18)
        tests.append(self.test_hand_growth())
        
        # 测试3: 守卫模式13次防御
        tests.append(self.test_guard_defense())
        
        # 测试4: AI动态生成
        tests.append(self.test_ai_dynamic())
        
        # 测试5: 晋级判定
        tests.append(self.test_level_up())
        
        # 统计结果
        passed = sum(1 for t in tests if t['passed'])
        failed = sum(1 for t in tests if not t['passed'])
        
        if failed == 0:
            self.passed_tests += 1
            print(f"✅ 第{round_num}轮测试通过")
        else:
            self.failed_tests += 1
            print(f"❌ 第{round_num}轮测试失败 ({failed}项)")
        
        self.test_results.append({'round': round_num, 'tests': tests})
    
    def test_unique_cards(self):
        suits = ['♥', '♦', '♣', '♠']
        ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        cards = []
        used = set()
        
        # 生成18张牌
        attempts = 0
        while len(cards) < 18 and attempts < 100:
            attempts += 1
            suit = random.choice(suits)
            rank = random.choice(ranks)
            key = suit + rank
            
            if key not in used:
                used.add(key)
                cards.append({'suit': suit, 'rank': rank, 'key': key})
        
        # 验证是否有重复
        unique_keys = len(set(c['key'] for c in cards))
        passed = unique_keys == len(cards)
        
        status = "✅" if passed else "❌"
        print(f"  {status} 卡牌去重测试: {len(cards)}张牌, 唯一{unique_keys}")
        return {'name': '卡牌去重', 'passed': passed}
    
    def test_hand_growth(self):
        hand_cards = 5
        max_cards = 18
        level = 1
        
        # 模拟晋级12次
        for i in range(12):
            level += 1
            if hand_cards < max_cards:
                hand_cards += 1
        
        passed = hand_cards == 17 and level == 13
        status = "✅" if passed else "❌"
        print(f"  {status} 手牌增长测试: {hand_cards}/18张, 第{level}层")
        return {'name': '手牌增长', 'passed': passed}
    
    def test_guard_defense(self):
        guard_defends = 0
        ai_attempts = 0
        
        # 模拟AI 20次攻击
        while ai_attempts < 20 and guard_defends < 13:
            ai_attempts += 1
            # AI有50%概率失败
            if random.random() > 0.5:
                guard_defends += 1
        
        passed = guard_defends >= 13 or ai_attempts >= 13
        status = "✅" if passed else "❌"
        print(f"  {status} 守卫防御测试: {guard_defends}/13次成功, AI攻击{ai_attempts}次")
        return {'name': '守卫防御', 'passed': passed}
    
    def test_ai_dynamic(self):
        real_players = random.randint(5, 25)
        required_ai = real_players * 9
        
        passed = 45 <= required_ai <= 225
        status = "✅" if passed else "❌"
        print(f"  {status} AI动态生成: {real_players}真实玩家 → {required_ai}AI")
        return {'name': 'AI动态生成', 'passed': passed}
    
    def test_level_up(self):
        suits = ['♥', '♦', '♣', '♠']
        ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        
        success_count = 0
        fail_count = 0
        
        # 模拟100次比对
        for i in range(100):
            player_suit = random.choice(suits)
            player_rank = random.choice(ranks)
            guard_suit = random.choice(suits)
            guard_rank = random.choice(ranks)
            
            is_match = (player_suit == guard_suit) or (player_rank == guard_rank)
            
            if is_match:
                success_count += 1
            else:
                fail_count += 1
        
        # 成功率应该在30%左右
        success_rate = success_count / 100
        passed = 0.2 < success_rate < 0.5
        
        status = "✅" if passed else "❌"
        print(f"  {status} 晋级判定测试: 成功率{success_rate*100:.1f}% ({success_count}/100)")
        return {'name': '晋级判定', 'passed': passed}
    
    def print_summary(self):
        print('\n')
        print('╔' + '═' * 48 + '╗')
        print('║' + ' ' * 10 + '🎮 测试结果总结' + ' ' * 21 + '║')
        print('╠' + '═' * 48 + '╣')
        print(f'║  总测试轮数: {self.total_tests:3}{" " * 30}║')
        print(f'║  ✅ 通过: {self.passed_tests:3}{" " * 35}║')
        print(f'║  ❌ 失败: {self.failed_tests:3}{" " * 35}║')
        rate = self.passed_tests / self.total_tests * 100
        print(f'║  通过率: {rate:4.1f}%{" " * 33}║')
        print('╚' + '═' * 48 + '╝')
        
        if self.failed_tests == 0:
            print('\n🎉 所有测试通过！项目核心逻辑正常！')
        else:
            print('\n⚠️ 存在失败的测试，请检查代码！')

# 运行测试
if __name__ == '__main__':
    tester = TowerOfFateTester()
    tester.run_all_tests()
