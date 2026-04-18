Vue.component('estimate-payment', {
	props: {
		displayResult: { type: Function },
		showLoading: { type: Function },
		hideLoading: { type: Function }
	},
	data() {
		return {
			confirmClearInputs: 'clear_inputs_confirm_modal',
			confirmClearMessage: 'Are you sure that you want to clear the current inputs?',
			unitTypes: UNIT_TYPES,
			unitType: null,
			loanAmount: null,
			feeAmount: 0,
			interestRate: null,
			unitAmount: null,
		}
	},
	methods: {
		clearInputs: function () {
			// Clear the various inputs.
			this.unitType = null;
			this.loanAmount = null;
			this.feeAmount = 0;
			this.interestRate = null;
			this.unitAmount = null;
		},
		submitForm: function (event) {
			event.preventDefault();

			// Validate the form before trying to select a number.
			$form = $('#estimatePaymentForm');
			var isValid = $form[0].checkValidity();
			$form.addClass('was-validated');
			// If validation failed, don't submit the form.
			if(isValid === false) {
				return false;
			}

			this.showLoading();
		
			// Perform actual calculation
			const loanHelper = new LoanHelper();
			const result = loanHelper.estimatePaymentAmount(this.loanAmount, this.feeAmount, this.interestRate, this.unitType, this.unitAmount);
			const message = 'Payment amount: ' + Number(result).toLocaleString(undefined, { minimumFractionDigits: 2,  maximumFractionDigits: 2 });

			this.hideLoading();
			this.displayResult(message);
		}
	},
	computed: {
		unitTypeState() {
			return this.unitType === null ? null : this.unitType > 0;
		},
		loanAmountState() {
			return this.loanAmount === null ? null : this.loanAmount > 0;
		},
		feeAmountState() {
			return this.feeAmount === null || this.feeAmount === 0 ? null : this.feeAmount > 0;
		},
		interestRateState() {
			return this.interestRate === null ? null : this.interestRate > 0;
		},
		unitAmountState() {
			return this.unitAmount === null ? null : this.unitAmount > 0;
		},
	},
	template: `
		<div>
			<b-form class="form" id="estimatePaymentForm">
				<b-form-group
					label="Loan amount"
					label-for="loanAmount"
				>
					<b-form-input type="number" name="loanAmount" id="loanAmount" class="form-control" v-model="loanAmount" :state="loanAmountState" min="0" step=".01" required></b-form-input>
				</b-form-group>
				<b-form-group
					label="Fee amount (escrow)"
					label-for="feeAmount"
				>
					<b-form-input type="number" name="feeAmount" id="feeAmount" class="form-control" v-model="feeAmount" :state="feeAmountState" min="0" step=".01" required></b-form-input>
				</b-form-group>
				<b-form-group
					label="Interest rate"
					label-for="interestRate"
				>
					<b-form-input type="number" name="interestRate" id="interestRate" class="form-control" v-model="interestRate" :state="interestRateState" min="0" step=".01" required></b-form-input>
				</b-form-group>
				<b-form-group
					label="Unit type"
					label-for="unitType"
				>
					<b-form-select v-model="unitType" :options="unitTypes" :state="unitTypeState" required>
						<!-- This slot appears above the options from 'options' prop -->
						<template #first>
							<b-form-select-option :value="null" disabled>-- Unit type? --</b-form-select-option>
						</template>
					</b-form-select>
				</b-form-group>
				<b-form-group
					label="Unit amount"
					label-for="unitAmount"
				>
					<b-form-input type="number" name="unitAmount" id="unitAmount" class="form-control" v-model="unitAmount" :state="unitAmountState" min="0" step="1" required></b-form-input>
				</b-form-group>
				<b-form-group class="text-right">
					<b-button variant="secondary" v-b-modal.clear_inputs_confirm_modal>Clear</b-button>
					<b-button type="submit" variant="primary" @click="submitForm">Submit</b-button>
				</b-form-group>
			</b-form>
			<confirm-modal :id="confirmClearInputs" :message="confirmClearMessage" :on-yes-function="clearInputs" />
		</div>
	`
});