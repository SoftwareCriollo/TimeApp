require 'rails_helper'

RSpec.describe Api::IterationsController, :type => :controller do

describe 'POST #create' do

  context 'Create new iteration' do
    let(:iteration){FactoryGirl.attributes_for(:iteration) }
    it 'Answer to a json' do
      post :create, iteration: iteration
      expect(response.status).to eq(201)
    end
    it "Changes the Iteration count" do
      expect { Iteration.create }.to change{ Iteration.count }.by(1)
    end
    
    end
end

end

