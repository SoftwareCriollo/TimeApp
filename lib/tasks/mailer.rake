task :hapiness => :environment do

	if (Time.now).strftime('%A') == 'Tuesday'
		HapinessMailer.new.send_to_all_clients
	end

end