require "rails_helper"

RSpec.describe Iteration, :type => :model do
	it { should respond_to(:start) }
	it { should respond_to(:end_date) }
	it { should respond_to(:time) }

  before{ stubbing_project_manager }
  describe "validate" do

    describe "presence" do
      it { should validate_presence_of(:start) }
      it { should validate_presence_of(:time) }
    end
  end

  describe "#close_iteration" do
    let(:user) {create(:user) }
    let!(:iteration) { create(:iteration, project_id: "my-project", time: 30, start: Date.today - 1.month)}
    let(:timelog_1){create(:timelog, user_id: user.id ,project_id: "my-project", time: 1, fecha: Date.today - 1.month)}
    let(:timelog_2){create(:timelog, user_id: user.id ,project_id: "my-project", time: 1, fecha: Date.today - 1.month)}
    before do
      timelog_1
      timelog_2
      iteration.close_iteration!
    end

    it { expect(iteration.end_date).to eql(timelog_2.fecha) }

  end

  describe "remain_time" do
    let!(:iteration) { create(:iteration, project_id: "my-project", time: 10 )}

    subject{ iteration.remain_time }
    before{ create(:timelog, user_id: user.id ,project_id: "my-project", time: 9) }

    context "apprentice" do
      let(:user) {create(:apprentice) }
      it { is_expected.to eql(7.0) }
    end
    context "not apprentice" do
      let(:user) {create(:user) }
      it { is_expected.to eql(1.0) }

    end
  end
end