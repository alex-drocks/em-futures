import {TestBed} from '@angular/core/testing';
import {FuturesCalculatorService} from './futures-calculator.service'; // Adjust the path accordingly
import {CycleEnum, DailyYieldPercent} from '../../components/futures/futures.definitions';
import {of} from "rxjs";
import {ActivatedRoute} from "@angular/router";

const activatedRouteStub = {
  snapshot: {queryParams: of({})},
};

describe('CalculatorService', () => {
  let service: FuturesCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FuturesCalculatorService,
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    });
    service = TestBed.inject(FuturesCalculatorService);
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

    it('should set years to forecast, respect boundaries ', () => {
      const testValue = 5;
      service.setYearsToForecast(testValue);
      expect(service.getYearsToForecast()).toEqual(testValue);
      service.setYearsToForecast(11);
      expect(service.getYearsToForecast()).toEqual(service.MAX_YEARS_FORECAST);
    });
  });

  describe('isStartWithdrawingBalance', () => {
    it('should return true when balance is equal to start withdrawing balance', () => {
      spyOn(service, 'getStartWithdrawingBalance').and.returnValue(2000);
      expect(service.isStartWithdrawingBalance(2000)).toBeTrue();
    });

    it('should return true when balance is greater than start withdrawing balance', () => {
      spyOn(service, 'getStartWithdrawingBalance').and.returnValue(2000);
      expect(service.isStartWithdrawingBalance(2001)).toBeTrue();
    });

    it('should return false when balance is less than start withdrawing balance', () => {
      spyOn(service, 'getStartWithdrawingBalance').and.returnValue(2000);
      expect(service.isStartWithdrawingBalance(1999)).toBeFalse();
    });
  });

  describe('isMaxWithdrawalsReached', () => {
    it('should return true when total withdrawals equal MAX_PAYOUTS', () => {
      const result = service.isMaxPayouts(service.MAX_PAYOUTS);
      expect(result).toBe(true);
    });

    it('should return true when total withdrawals exceed MAX_PAYOUTS', () => {
      const result = service.isMaxPayouts(service.MAX_PAYOUTS + 1);
      expect(result).toBe(true);
    });

    it('should return false when total withdrawals are below MAX_PAYOUTS', () => {
      const result = service.isMaxPayouts(service.MAX_PAYOUTS - 1);
      expect(result).toBe(false);
    });
  });

  describe('isMaxBalance', () => {
    it('should return true when balance equals MAX_BALANCE', () => {
      const result = service.isMaxBalance(service.MAX_BALANCE);
      expect(result).toBe(true);
    });

    it('should return true when balance exceeds MAX_BALANCE', () => {
      const result = service.isMaxBalance(service.MAX_BALANCE + 1);
      expect(result).toBe(true);
    });

    it('should return false when balance is below MAX_BALANCE', () => {
      const result = service.isMaxBalance(service.MAX_BALANCE - 1);
      expect(result).toBe(false);
    });
  });

  describe('getDailyYieldPercent', () => {
    it('should return PERCENT_0_500 for compoundSurplus < 50_000', () => {
      const totalCompounded = 10_000;
      const totalDeposited = 49_999;
      expect(service.getDailyYieldPercent(totalCompounded, totalDeposited)).toEqual(DailyYieldPercent.PERCENT_0_500);
    });

    it('should return PERCENT_0_450 for compoundSurplus in range [50_000, 250_000)', () => {
      const totalCompounded = 200_000;
      const totalDeposited = 50_000;
      expect(service.getDailyYieldPercent(totalCompounded, totalDeposited)).toEqual(DailyYieldPercent.PERCENT_0_450);
    });

    it('should return PERCENT_0_425 for compoundSurplus in range [250_000, 500_000)', () => {
      const totalCompounded = 450_000;
      const totalDeposited = 200_000;
      expect(service.getDailyYieldPercent(totalCompounded, totalDeposited)).toEqual(DailyYieldPercent.PERCENT_0_425);
    });

    it('should return PERCENT_0_375 for compoundSurplus in range [500_000, 750_000)', () => {
      const totalCompounded = 700_000;
      const totalDeposited = 200_000;
      expect(service.getDailyYieldPercent(totalCompounded, totalDeposited)).toEqual(DailyYieldPercent.PERCENT_0_375);
    });

    it('should return PERCENT_0_325 for compoundSurplus in range [750_000, 1_000_000)', () => {
      const totalCompounded = 900_000;
      const totalDeposited = 150_000;
      expect(service.getDailyYieldPercent(totalCompounded, totalDeposited)).toEqual(DailyYieldPercent.PERCENT_0_325);
    });

    it('should return PERCENT_0_250 for compoundSurplus >= 1_000_000', () => {
      const totalCompounded = 1_500_000;
      const totalDeposited = 500_000;
      expect(service.getDailyYieldPercent(totalCompounded, totalDeposited)).toEqual(DailyYieldPercent.PERCENT_0_250);
    });
  });

});
