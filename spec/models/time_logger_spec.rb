require "rails_helper"

RSpec.describe TimeLogger, :type => :model do
  before(:each) do
    User.destroy_all
    Iteration.destroy_all
    Timelog.destroy_all
    stubbing_project_manager
  end
  let(:user) { create(:user) }
  subject{ TimeLogger.new(user)}

  describe "validate" do
    let!(:iteration){ create(:iteration, project_id:"is-an-id",start: DateTime.now - 1.day)}
    describe "presence" do
      it { is_expected.to validate_presence_of(:project_name) }
      it { is_expected.to validate_presence_of(:project_id) }
    end
  end
  describe "#register" do
    let(:timelog_1){ attributes_for(:timelog)}
    let(:timelog_2){ attributes_for(:timelog)}
    let(:attributes){ {project_id: "is-an-id", project_name: "this is my name", timelogs_attributes: [timelog_1,timelog_2]}}
    let(:time_logger){ TimeLogger.new(user)}

    describe "iteration" do
      describe "existing" do
        let!(:iteration){ create(:iteration, project_id:"is-an-id",start: DateTime.now - 1.day)}      
        it{ expect{ time_logger.create(attributes) }.to change{Timelog.count}.by(2) }
      end
      describe "not existing" do
        it{ expect{ time_logger.create(attributes) }.to change{Timelog.count}.by(0) }
      end
    end
  end
end
