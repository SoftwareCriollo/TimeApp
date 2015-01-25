require "rails_helper"

RSpec.describe Timelog, :type => :model do

  before(:each) do
    Iteration.destroy_all
    Timelog.destroy_all
    stubbing
  end

  let(:user) { create(:user) }

	it { is_expected.to respond_to(:time) }
	it { is_expected.to respond_to(:comment) }
	it { is_expected.to respond_to(:trello) }
  it { is_expected.to respond_to(:task_id) }
  it { is_expected.to respond_to(:task_name) }
  it { is_expected.to respond_to(:project_id) }
	it { is_expected.to respond_to(:project_name) }

  describe "validate" do
    describe "presence" do
      it { is_expected.to validate_numericality_of(:time).is_greater_than(0) }
      it { is_expected.to validate_presence_of(:comment) }
      it { is_expected.to validate_presence_of(:trello) }
      it { is_expected.to validate_presence_of(:task_id) }
    end
    context "iteration" do
      subject { build(:timelog, project_id:'id') }

      context 'exists' do
        let!(:iteration){ create(:iteration, project_id: 'id') }
        it { is_expected.to be_valid }

        context "iteration full hours" do
          let!(:iteration){ create(:iteration, project_id: 'id') }
          before{ allow_any_instance_of(Iteration).to receive(:can_register_hours?).and_return(false) }

          it { is_expected.to_not be_valid }
        end
        context "can't be added a day after" do
          let!(:iteration){ create(:iteration, project_id: 'id',start: DateTime.now + 2.days) }
          it { is_expected.to_not be_valid }
        end

      end
      context "not exists" do
        it { is_expected.to_not be_valid }
      end
    end
  end
end
