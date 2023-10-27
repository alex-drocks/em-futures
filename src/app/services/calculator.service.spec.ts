import {TestBed} from '@angular/core/testing';
import {CalculatorService} from './calculator.service'; // Adjust the path accordingly
import {CycleEnum, DailyRewardsPercent} from '../app.definitions';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
    service.resetDefaults();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Setters', () => {
    it('should have default values', () => {
      service.resetDefaults();
      expect(service.getDateStart()).toEqual(service.defaults.dateStart);
      expect(service.getInitialDeposit()).toEqual(service.defaults.initialDeposit);
      expect(service.getRegularDeposit()).toEqual(service.defaults.regularDeposit);
      expect(service.getDepositCycle()).toEqual(service.defaults.depositCycle);
      expect(service.getWithdrawCycle()).toEqual(service.defaults.withdrawCycle);
      expect(service.getStartWithdrawingBalance()).toEqual(service.defaults.startWithdrawingBalance);
      expect(service.getStopDepositingBalance()).toEqual(service.defaults.stopDepositingBalance);
      expect(service.getYearsToForecast()).toEqual(service.defaults.yearsToForecast);
    });

    it('should set date start ', () => {
      const testDate = new Date(2023, 1, 1);
      service.setDateStart(testDate);
      expect(service.getDateStart()).toEqual(testDate);
    });

    it('should set initial deposit, respect boundaries ', () => {
      const testValue = 5000;
      service.setInitialDeposit(testValue);
      expect(service.getInitialDeposit()).toEqual(testValue);
      service.setInitialDeposit(50); // Less than MIN_DEPOSIT
      expect(service.getInitialDeposit()).toEqual(service.MIN_DEPOSIT);
    });

    it('should set regular deposit, respect boundaries ', () => {
      const testValue = 1000;
      service.setRegularDeposit(testValue);
      expect(service.getRegularDeposit()).toEqual(testValue);
      service.setRegularDeposit(50); // Less than MIN_DEPOSIT
      expect(service.getRegularDeposit()).toEqual(service.MIN_DEPOSIT);
    });

    it('should set deposit cycle ', () => {
      service.setDepositCycle(CycleEnum.DAY);
      expect(service.getDepositCycle()).toEqual(CycleEnum.DAY);
    });

    it('should set withdrawal cycle ', () => {
      service.setWithdrawCycle(CycleEnum.DAY);
      expect(service.getWithdrawCycle()).toEqual(CycleEnum.DAY);
    });

    it('should set start withdrawing balance, respect boundaries ', () => {
      const testValue = 6000;
      service.setStartWithdrawingBalance(testValue);
      expect(service.getStartWithdrawingBalance()).toEqual(testValue);
      service.setStartWithdrawingBalance(50); // Less than MIN_DEPOSIT
      expect(service.getStartWithdrawingBalance()).toEqual(service.MIN_DEPOSIT);
    });

    it('should set stop depositing balance, respect boundaries ', () => {
      const testValue = 500000;
      service.setStopDepositingBalance(testValue);
      expect(service.getStopDepositingBalance()).toEqual(testValue);
      service.setStopDepositingBalance(1000001); // More than MAX_BALANCE
      expect(service.getStopDepositingBalance()).toEqual(service.MAX_BALANCE);
    });

    it('should set years to forecast, respect boundaries ', () => {
      const testValue = 5;
      service.setYearsToForecast(testValue);
      expect(service.getYearsToForecast()).toEqual(testValue);
      service.setYearsToForecast(11);
      expect(service.getYearsToForecast()).toEqual(service.MAX_YEARS_FORECAST);
    });
  });

  describe('isStopDepositBalanceReached', () => {
    it('should return true when balance is equal to stop depositing balance', () => {
      spyOn(service, 'getStopDepositingBalance').and.returnValue(1000);
      expect(service.isStopDepositBalanceReached(1000)).toBeTrue();
    });

    it('should return true when balance is greater than stop depositing balance', () => {
      spyOn(service, 'getStopDepositingBalance').and.returnValue(1000);
      expect(service.isStopDepositBalanceReached(1001)).toBeTrue();
    });

    it('should return false when balance is less than stop depositing balance', () => {
      spyOn(service, 'getStopDepositingBalance').and.returnValue(1000);
      expect(service.isStopDepositBalanceReached(999)).toBeFalse();
    });
  });

  describe('isStartWithdrawingBalanceReached', () => {
    it('should return true when balance is equal to start withdrawing balance', () => {
      spyOn(service, 'getStartWithdrawingBalance').and.returnValue(2000);
      expect(service.isStartWithdrawingBalanceReached(2000)).toBeTrue();
    });

    it('should return true when balance is greater than start withdrawing balance', () => {
      spyOn(service, 'getStartWithdrawingBalance').and.returnValue(2000);
      expect(service.isStartWithdrawingBalanceReached(2001)).toBeTrue();
    });

    it('should return false when balance is less than start withdrawing balance', () => {
      spyOn(service, 'getStartWithdrawingBalance').and.returnValue(2000);
      expect(service.isStartWithdrawingBalanceReached(1999)).toBeFalse();
    });
  });

  describe('isMaxWithdrawalsReached', () => {
    it('should return true when total withdrawals equal MAX_WITHDRAWAL', () => {
      const result = service.isMaxWithdrawalsReached(service.MAX_WITHDRAWAL);
      expect(result).toBe(true);
    });

    it('should return true when total withdrawals exceed MAX_WITHDRAWAL', () => {
      const result = service.isMaxWithdrawalsReached(service.MAX_WITHDRAWAL + 1);
      expect(result).toBe(true);
    });

    it('should return false when total withdrawals are below MAX_WITHDRAWAL', () => {
      const result = service.isMaxWithdrawalsReached(service.MAX_WITHDRAWAL - 1);
      expect(result).toBe(false);
    });
  });

  describe('isMaxBalanceReached', () => {
    it('should return true when balance equals MAX_BALANCE', () => {
      const result = service.isMaxBalanceReached(service.MAX_BALANCE);
      expect(result).toBe(true);
    });

    it('should return true when balance exceeds MAX_BALANCE', () => {
      const result = service.isMaxBalanceReached(service.MAX_BALANCE + 1);
      expect(result).toBe(true);
    });

    it('should return false when balance is below MAX_BALANCE', () => {
      const result = service.isMaxBalanceReached(service.MAX_BALANCE - 1);
      expect(result).toBe(false);
    });
  });

  describe('postWithdrawalExceedsMax', () => {
    it('should return true when post-withdrawal sum equals MAX_WITHDRAWAL', () => {
      const result = service.postWithdrawalExceedsMax(service.MAX_WITHDRAWAL, 0);
      expect(result).toBe(true);
    });

    it('should return true when post-withdrawal sum exceeds MAX_WITHDRAWAL', () => {
      const result = service.postWithdrawalExceedsMax(service.MAX_WITHDRAWAL - 1, 2);
      expect(result).toBe(true);
    });

    it('should return false when post-withdrawal sum is below MAX_WITHDRAWAL', () => {
      const result = service.postWithdrawalExceedsMax(service.MAX_WITHDRAWAL - 2, 1);
      expect(result).toBe(false);
    });
  });

  describe('postDepositExceedsMaxBalance', () => {
    it('should return true when post-deposit sum equals MAX_BALANCE', () => {
      const balance = service.MAX_BALANCE - service.getRegularDeposit();
      const result = service.postDepositExceedsMaxBalance(balance, 0);
      expect(result).toBe(true);
    });

    it('should return true when post-deposit sum exceeds MAX_BALANCE', () => {
      const balance = service.MAX_BALANCE - service.getRegularDeposit();
      const result = service.postDepositExceedsMaxBalance(balance, 1);
      expect(result).toBe(true);
    });

    it('should return false when post-deposit sum is below MAX_BALANCE', () => {
      const balance = service.MAX_BALANCE - service.getRegularDeposit() - 2;
      const result = service.postDepositExceedsMaxBalance(balance, 1);
      expect(result).toBe(false);
    });
  });

  describe('canDeposit', () => {
    it('should return false if balance exceeds user deposit limit', () => {
      spyOn(service, 'isStopDepositBalanceReached').and.returnValue(true);
      const result = service.canDeposit(service.getStopDepositingBalance(), 0);
      expect(result).toBe(false);
    });

    it('should return false if balance exceeds system max balance', () => {
      spyOn(service, 'isStopDepositBalanceReached').and.returnValue(false);
      spyOn(service, 'isMaxBalanceReached').and.returnValue(true);
      const result = service.canDeposit(service.MAX_BALANCE - service.getRegularDeposit(), 0);
      expect(result).toBe(false);
    });

    it('should return false if post-deposit sum exceeds system max balance', () => {
      spyOn(service, 'isStopDepositBalanceReached').and.returnValue(false);
      spyOn(service, 'isMaxBalanceReached').and.returnValue(false);
      spyOn(service, 'postDepositExceedsMaxBalance').and.returnValue(true);
      const result = service.canDeposit(service.MAX_BALANCE - service.getRegularDeposit(), 1);
      expect(result).toBe(false);
    });

    it('should return true if all conditions are met', () => {
      spyOn(service, 'isStopDepositBalanceReached').and.returnValue(false);
      spyOn(service, 'isMaxBalanceReached').and.returnValue(false);
      spyOn(service, 'postDepositExceedsMaxBalance').and.returnValue(false);
      const result = service.canDeposit(service.MAX_BALANCE - service.getRegularDeposit() - 2, 1);
      expect(result).toBe(true);
    });

    it('should return true with a real function call', () => {
      const deposit = service.getRegularDeposit();
      const result = service.canDeposit(service.MAX_BALANCE - (deposit + 2), 1);
      expect(result).toBe(true);
    });

    it('should return false with a real function call', () => {
      const deposit = service.getRegularDeposit();
      const result = service.canDeposit(service.MAX_BALANCE - (deposit + 1), 2);
      expect(result).toBe(false);
    });
  });

  describe('canWithdraw', () => {

    it('should return false if balance is below user withdrawal start limit', () => {
      spyOn(service, 'isStartWithdrawingBalanceReached').and.returnValue(false);
      const result = service.canWithdraw(service.getStartWithdrawingBalance() - 1, 0, 0);
      expect(result).toBe(false);
    });

    it('should return false if total withdrawals exceed system max withdrawals', () => {
      spyOn(service, 'isStartWithdrawingBalanceReached').and.returnValue(true);
      spyOn(service, 'isMaxWithdrawalsReached').and.returnValue(true);
      const result = service.canWithdraw(service.getStartWithdrawingBalance(), 1 + service.MAX_WITHDRAWAL, 0);
      expect(result).toBe(false);
    });

    it('should return false if post-withdrawal sum exceeds system max withdrawals', () => {
      spyOn(service, 'isStartWithdrawingBalanceReached').and.returnValue(true);
      spyOn(service, 'isMaxWithdrawalsReached').and.returnValue(false);
      spyOn(service, 'postWithdrawalExceedsMax').and.returnValue(true);
      const result = service.canWithdraw(service.getStartWithdrawingBalance(), 1500, 1000);
      expect(result).toBe(false);
    });

    it('should return true if all conditions are met', () => {
      spyOn(service, 'isStartWithdrawingBalanceReached').and.returnValue(true);
      spyOn(service, 'isMaxWithdrawalsReached').and.returnValue(false);
      spyOn(service, 'postWithdrawalExceedsMax').and.returnValue(false);
      const result = service.canWithdraw(service.getStartWithdrawingBalance(), 500, 1000);
      expect(result).toBe(true);
    });

    it('should return true with a real function call', () => {
      const result = service.canWithdraw(service.getStartWithdrawingBalance(), 500, 1000);
      expect(result).toBe(true);
    });

    it('should return false with a real function call', () => {
      const result = service.canWithdraw(service.getStartWithdrawingBalance(), 2, service.MAX_WITHDRAWAL);
      expect(result).toBe(false);
    });
  });

  describe('getDailyRewardsPercent', () => {
    it('should return PERCENT_0_500 for compoundSurplus < 50_000', () => {
      const totalCompounded = 10_000;
      const totalDeposited = 49_999;
      expect(service.getDailyRewardsPercent(totalCompounded, totalDeposited)).toEqual(DailyRewardsPercent.PERCENT_0_500);
    });

    it('should return PERCENT_0_450 for compoundSurplus in range [50_000, 250_000)', () => {
      const totalCompounded = 200_000;
      const totalDeposited = 50_000;
      expect(service.getDailyRewardsPercent(totalCompounded, totalDeposited)).toEqual(DailyRewardsPercent.PERCENT_0_450);
    });

    it('should return PERCENT_0_425 for compoundSurplus in range [250_000, 500_000)', () => {
      const totalCompounded = 450_000;
      const totalDeposited = 200_000;
      expect(service.getDailyRewardsPercent(totalCompounded, totalDeposited)).toEqual(DailyRewardsPercent.PERCENT_0_425);
    });

    it('should return PERCENT_0_375 for compoundSurplus in range [500_000, 750_000)', () => {
      const totalCompounded = 700_000;
      const totalDeposited = 200_000;
      expect(service.getDailyRewardsPercent(totalCompounded, totalDeposited)).toEqual(DailyRewardsPercent.PERCENT_0_375);
    });

    it('should return PERCENT_0_325 for compoundSurplus in range [750_000, 1_000_000)', () => {
      const totalCompounded = 900_000;
      const totalDeposited = 150_000;
      expect(service.getDailyRewardsPercent(totalCompounded, totalDeposited)).toEqual(DailyRewardsPercent.PERCENT_0_325);
    });

    it('should return PERCENT_0_250 for compoundSurplus >= 1_000_000', () => {
      const totalCompounded = 1_500_000;
      const totalDeposited = 500_000;
      expect(service.getDailyRewardsPercent(totalCompounded, totalDeposited)).toEqual(DailyRewardsPercent.PERCENT_0_250);
    });
  });

});
