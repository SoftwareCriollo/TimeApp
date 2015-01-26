require "rails_helper"

RSpec.describe Iteration, :type => :model do
	it { should respond_to(:start) }
	it { should respond_to(:end_date) }
	it { should respond_to(:time) }

  describe "validate" do

    describe "presence" do
      it { should validate_presence_of(:start) }
      it { should validate_presence_of(:end_date) }
      it { should validate_presence_of(:time) }
    end
  end

  describe "remain_time" do
    let!(:iteration) { create(:iteration, project_id: "my-project", time: 10 )}

    subject{ iteration.remain_time }

    before{ stubbing_project_manager }
    before{ create(:timelog, user_id: user.id ,project_id: "my-project", time: 9) }

    context "apprentice" do
      let(:user) {create(:apprentice) }
      it { is_expected.to eql(12.0) }   
    end
    context "not apprentice" do
      let(:user) {create(:user) }
      it { is_expected.to eql(6.0) }   

    end
  end 
end